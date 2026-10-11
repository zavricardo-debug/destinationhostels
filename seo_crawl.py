import re, html, json, csv, urllib.request, gzip, io
from concurrent.futures import ThreadPoolExecutor

UA={'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36','Accept-Encoding':'gzip'}
urls="""https://www.destinationhostels.com/
https://www.destinationhostels.com/accomodation/lisbon-destination-hostel/
https://www.destinationhostels.com/accomodation/sunset-destination-hostel/
https://www.destinationhostels.com/accomodation/alfama-patio-apartments/
https://www.destinationhostels.com/accomodation/hi-arrifana-destination-hostel/
https://www.destinationhostels.com/accomodation/arrifana-destination-suites/
https://www.destinationhostels.com/accomodation/porto-santo-destination/
https://www.destinationhostels.com/accomodation/porto-santo-apartments/
https://www.destinationhostels.com/accomodation/ericeira-destination/
https://www.destinationhostels.com/about/
https://www.destinationhostels.com/contacts/
https://www.destinationhostels.com/blog/
https://www.destinationhostels.com/porto-santo/
https://www.destinationhostels.com/arrifana/
https://www.destinationhostels.com/ericeira/
https://www.destinationhostels.com/sustainability/
https://www.destinationhostels.com/groups/
https://www.destinationhostels.com/nomad-destinations-pass/
https://www.destinationhostels.com/volunteer-program/
https://www.destinationhostels.com/consulting/
https://www.destinationhostels.com/lisbon-destination-hostel/
https://www.destinationhostels.com/special-deal/coliving/
https://www.destinationhostels.com/special-deal/early-booker/
https://www.destinationhostels.com/special-deal/long-term-stay/""".split()

def get(u):
    try:
        r=urllib.request.urlopen(urllib.request.Request(u,headers=UA),timeout=25)
        raw=r.read()
        if r.headers.get('Content-Encoding')=='gzip': raw=gzip.decompress(raw)
        return r.status, raw.decode('utf-8','ignore')
    except urllib.error.HTTPError as e:
        return e.code,''
    except Exception as e:
        return 'ERR:'+str(e)[:60],''

def analyze(u):
    st,h=get(u)
    d={'url':u,'status':st}
    if not h: return d
    def one(p,f=re.I|re.S):
        m=re.search(p,h,f); return html.unescape(m.group(1)).strip() if m else ''
    d['title']=one(r'<title[^>]*>(.*?)</title>')
    d['title_len']=len(d['title'])
    d['meta_desc']=one(r'<meta[^>]+name=["\']description["\'][^>]+content=["\']([^"\']*)["\']')
    if not d['meta_desc']: d['meta_desc']=one(r'<meta[^>]+content=["\']([^"\']*)["\'][^>]+name=["\']description["\']')
    d['desc_len']=len(d['meta_desc'])
    d['h1']=' | '.join(re.findall(r'<h1[^>]*>(.*?)</h1>',h,re.I|re.S))[:200]
    d['h1']=re.sub(r'<[^>]+>','',html.unescape(d['h1'])).strip()
    d['h1_n']=len(re.findall(r'<h1[^>]*>',h,re.I))
    d['h2_n']=len(re.findall(r'<h2[^>]*>',h,re.I))
    d['canonical']=one(r'<link[^>]+rel=["\']canonical["\'][^>]*href=["\']([^"\']+)')
    d['og_count']=len(re.findall(r'property=["\']og:title["\']',h,re.I))
    d['desc_count']=len(re.findall(r'name=["\']description["\']',h,re.I))
    text=re.sub(r'<(script|style|noscript)[^>]*>.*?</\1>','',h,flags=re.S|re.I)
    text=html.unescape(re.sub(r'<[^>]+>',' ',text)); text=re.sub(r'\s+',' ',text)
    d['words']=len(text.split())
    d['schema_types']=','.join(sorted(set(re.findall(r'"@type"\s*:\s*"([^"]+)"',h))))
    imgs=re.findall(r'<img[^>]*>',h,re.I)
    d['imgs']=len(imgs)
    d['imgs_no_alt']=sum(1 for i in imgs if not re.search(r'alt=["\'][^"\']+["\']',i,re.I))
    d['imgs_not_lazy']=sum(1 for i in imgs if 'loading=' not in i.lower() and 'data-src' not in i.lower())
    d['h1_len']=len(d['h1'])
    return d

with ThreadPoolExecutor(6) as ex:
    rows=list(ex.map(analyze,urls))
with open('seo_audit.csv','w',newline='',encoding='utf-8') as f:
    w=csv.DictWriter(f,fieldnames=list(rows[0].keys())); w.writeheader(); w.writerows(rows)
for r in rows:
    print(f"\n{r['status']} {r['url']}")
    print(f"   TITLE ({r.get('title_len')}): {r.get('title')}")
    print(f"   DESC  ({r.get('desc_len')}): {r.get('meta_desc')}")
    print(f"   H1 ({r.get('h1_n')}): {(r.get('h1') or '')[:110]} | H2s:{r.get('h2_n')} | words:{r.get('words')}")
    print(f"   schema:{r.get('schema_types')} | og:title x{r.get('og_count')} | desc x{r.get('desc_count')} | imgs:{r.get('imgs')} s/alt:{r.get('imgs_no_alt')}")
