import zipfile
import xml.etree.ElementTree as ET
import json

def parse_xlsx(filepath):
    z = zipfile.ZipFile(filepath)
    shared_strings = []
    if 'xl/sharedStrings.xml' in z.namelist():
        tree = ET.fromstring(z.read('xl/sharedStrings.xml'))
        for si in tree.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}si'):
            t_elems = si.findall('.//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t')
            text = ''.join([t.text or '' for t in t_elems])
            shared_strings.append(text)
    
    rows = []
    if 'xl/worksheets/sheet1.xml' in z.namelist():
        tree = ET.fromstring(z.read('xl/worksheets/sheet1.xml'))
        for row in tree.findall('.//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}row'):
            row_data = []
            for c in row.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}c'):
                t_attr = c.attrib.get('t')
                v_elem = c.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}v')
                v = v_elem.text if v_elem is not None else ''
                if t_attr == 's' and v.isdigit():
                    idx = int(v)
                    val = shared_strings[idx] if idx < len(shared_strings) else v
                else:
                    val = v
                row_data.append(val)
            rows.append(row_data)
    return rows

files = [
    ("Ba Ria", "scripts/di_tich_ba_ria_cu.xlsx"),
    ("Binh Duong", "scripts/di_tich_binh_duong_cu.xlsx"),
    ("TPHCM", "scripts/di_tich_tphcm_cu.xlsx")
]

all_data = {}
for name, f in files:
    rows = parse_xlsx(f)
    all_data[name] = rows

with open("scripts/parsed_ref_excels.json", "w", encoding="utf-8") as out:
    json.dump(all_data, out, ensure_ascii=False, indent=2)

print("Saved scripts/parsed_ref_excels.json successfully")
