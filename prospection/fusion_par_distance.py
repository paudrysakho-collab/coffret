import csv, math, re, json, unicodedata, urllib.request, urllib.parse, openpyxl
from openpyxl.styles import PatternFill, Font, Alignment
LAT,LON=47.189658,-1.550635
def km(la,lo):
    p=math.pi/180; a=math.sin((la-LAT)*p/2)**2+math.cos(LAT*p)*math.cos(la*p)*math.sin((lo-LON)*p/2)**2
    return round(12742*math.asin(math.sqrt(a)),1)
def n(s): return re.sub(r'[^a-z]','',unicodedata.normalize('NFD',(s or '').lower()).encode('ascii','ignore').decode())
CENT={}
def centre(city):
    city='Nantes' if 'nantaise' in (city or '') else city
    if city not in CENT:
        u='https://api-adresse.data.gouv.fr/search/?type=municipality&limit=1&q='+urllib.parse.quote(city)+'&postcode='
        import time
        for t in range(12):
            try: j=json.load(urllib.request.urlopen('https://api-adresse.data.gouv.fr/search/?type=municipality&limit=1&q='+urllib.parse.quote(city+' 44'),timeout=30)); break
            except Exception: time.sleep(2)
        lo,la=j['features'][0]['geometry']['coordinates']; CENT[city]=(la,lo)
    return CENT[city]
G={r['email']:r for r in csv.DictReader(open('geo.csv'))}
# grande liste (sans STOP ni rebonds)
gws=openpyxl.load_workbook('/home/user/coffret/prospection/prospection_totale.xlsx').active
gh=[c.value for c in gws[1]]
ids={r['email'].lower():r['id_prospect'] for r in csv.DictReader(open('/home/user/recherche-client-csp-/claude/campagne/envoi_complet_programme_GMAIL.csv',encoding='utf-8-sig'))}
big={}
for r in gws.iter_rows(min_row=2,values_only=True):
    d=dict(zip(gh,r)); e=d['Email'].lower(); g=G[e]
    sc=float(g['result_score'] or 0)
    if g['result_type'] in('housenumber','street') and (sc>=0.6 or n(g['result_city'])==n(g['city'])):
        dist=km(float(g['latitude']),float(g['longitude'])); prec='adresse'
    else:
        dist=km(*centre(d['Commune'])); prec='centre de la commune'
    big[e]=dict(dist=dist,prec=prec,nom=d['Entreprise'],metier=d['Métier'],email=d['Email'],autres=None,tel=d['Téléphone'],
        adr=g['result_label'] if prec=='adresse' else None,cp=d['Code postal'] or g['result_postcode'],commune=d['Commune'],gerant=d['Gérant(e)'],
        taille=None,date=d["Date et heure d'envoi"],siret=(ids.get(e,'') or '').replace('FR-','') or None,orig='Grande liste',coul=None)
# liste Rezé
pws=openpyxl.load_workbook('/home/user/coffret/prospection/prospection_reze.xlsx').worksheets[0]
ph=[c.value for c in pws[1]]
out=[]; bysiret={v['siret']:k for k,v in big.items() if v['siret']}
for row in pws.iter_rows(min_row=2):
    d=dict(zip(ph,[c.value for c in row])); col=row[0].fill.fgColor.rgb
    coul='vert' if col and col.endswith('C6EFCE') else 'orange' if col and col.endswith('FCD5B4') else None
    m=re.search(r'(\d{5})\s+(.+)$',d['Adresse'] or '')
    rec=dict(dist=d['Distance (km)'],prec='adresse (registre)' if d['Distance (km)'] is not None else 'inconnue',nom=d['Entreprise'],metier=d['Métier'],email=d['Email'],
        autres=d['Autres emails'],tel=d['Téléphone'],adr=d['Adresse'],cp=m.group(1) if m else None,commune=m.group(2).title() if m else None,
        gerant=d['Gérant(e)'],taille=d['Taille'],date=None,siret=d['SIRET'],orig={'vert':'Nouvelle (liste Rezé)','orange':'Liste Rezé de la maman'}.get(coul,'Liste Rezé, déjà dans la grande liste'),coul=coul)
    k=(d['Email'] or '').lower()
    k2=k if k in big else bysiret.get(str(d['SIRET']))
    if k2 and k2 in big:
        b=big.pop(k2); rec['date']=b['date']
        if b['email'].lower()!=k: rec['autres']='; '.join(x for x in [b['email'],rec['autres']] if x)
        if rec['dist'] is None: rec['dist'],rec['prec']=b['dist'],b['prec']
        if not rec['coul']: rec['orig']='Grande liste + liste Rezé'
    if rec['dist'] is None:
        c=rec['commune'] or ('Rezé' if 'REZE' in (d['Adresse'] or '').upper() else None)
        if not c and rec['adr']:
            import time
            for t in range(12):
                try:
                    j=json.load(urllib.request.urlopen('https://api-adresse.data.gouv.fr/search/?limit=1&postcode=44400&q='+urllib.parse.quote(rec['adr']+' Rezé'),timeout=30)); break
                except Exception: j=None; time.sleep(2)
            f=(j or {}).get('features') or []
            if f and f[0]['properties']['score']>=0.5 and f[0]['properties']['type'] in ('housenumber','street'):
                lo,la=f[0]['geometry']['coordinates']; rec['dist'],rec['prec']=km(la,lo),'adresse'; rec['adr']=f[0]['properties']['label']; rec['cp'],rec['commune']='44400','Rezé'
        if c and rec['dist'] is None:
            try: rec['dist'],rec['prec']=km(*centre(c)),'centre de la commune'
            except Exception: pass
    out.append(rec)
out+=big.values()
out.sort(key=lambda r:(r['dist'] is None, r['dist'] if r['dist'] is not None else 0))
wb=openpyxl.Workbook(); ws=wb.active; ws.title='Prospection totale'
H=['N°','Distance de la Cave 71 (km)','Distance calculée depuis','Entreprise','Métier','Email','Autres emails','Téléphone','Adresse','Code postal','Commune','Gérant(e)','Taille','Liste d’origine','Déjà invité(e) le (pot de l’amitié)','SIRET']
ws.append(H)
F={'vert':PatternFill('solid',fgColor='C6EFCE'),'orange':PatternFill('solid',fgColor='FCD5B4')}
for i,r in enumerate(out,1):
    ws.append([i,r['dist'],r['prec'],r['nom'],r['metier'],r['email'],r['autres'],r['tel'],r['adr'],r['cp'],r['commune'],r['gerant'],r['taille'],r['orig'],r['date'],r['siret']])
    if r['coul']:
        for c in ws[ws.max_row]: c.fill=F[r['coul']]
for c in ws[1]: c.font=Font(bold=True,color='FFFFFF'); c.fill=PatternFill('solid',fgColor='7A1F2B'); c.alignment=Alignment(wrap_text=True,vertical='center')
for L,w in zip('ABCDEFGHIJKLMNOP',[6,11,18,32,28,34,30,15,42,10,18,22,16,30,18,16]): ws.column_dimensions[L].width=w
ws.freeze_panes='D2'; ws.auto_filter.ref=ws.dimensions
lm=wb.create_sheet('Lisez-moi')
for t in ['Prospection totale — Cave 71, 71 avenue de la Libération, 44400 Rezé',
 'Une seule liste : la grande liste de la campagne d’octobre + la liste de proximité de Rezé, sans doublon.',
 'Triée de la plus proche à la plus éloignée de la Cave 71 (distance à vol d’oiseau).',
 'Vert = nouvelle entreprise (jamais contactée). Orange = vient de la liste Rezé de la maman. Blanc = grande liste (déjà invitée au pot de l’amitié).',
 'Retirés : les 8 entreprises qui ont répondu STOP (dont OC Com’unique) et les adresses revenues en erreur.',
 'Colonne « Distance calculée depuis » : « adresse » = distance exacte ; « centre de la commune » = adresse inconnue, distance approchée.',
 'Aucun mail n’est envoyé par Claude : c’est vous qui envoyez.']: lm.append([t])
lm.column_dimensions['A'].width=130
wb.save('/home/user/coffret/prospection/prospection_totale_par_distance.xlsx')
import collections
print(len(out), collections.Counter(r['orig'] for r in out), collections.Counter(r['prec'] for r in out))
print('emails en double:', len(out)-len({(r['email'] or '').lower() for r in out}))
print([ (r['dist'],r['nom']) for r in out[:5]], [(r['dist'],r['nom']) for r in out[-3:]])
