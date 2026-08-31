import zipfile
import xml.etree.ElementTree as ET
import re

def parse_xlsx(filepath):
    print(f"\n================ PARSING {filepath} ================")
    z = zipfile.ZipFile(filepath)
    
    # Read shared strings
    shared_strings = []
    if 'xl/sharedStrings.xml' in z.namelist():
        tree = ET.fromstring(z.read('xl/sharedStrings.xml'))
        for si in tree.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}si'):
            t_elems = si.findall('.//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t')
            text = ''.join([t.text or '' for t in t_elems])
            shared_strings.append(text)
    
    # Read sheet1.xml
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
            
    print(f"Total rows: {len(rows)}")
    for i, r in enumerate(rows[:5]):
        print(f"Row {i}: {r}")
    return rows

r1 = parse_xlsx("scripts/di_tich_ba_ria_cu.xlsx")
r2 = parse_xlsx("scripts/di_tich_binh_duong_cu.xlsx")
r3 = parse_xlsx("scripts/di_tich_tphcm_cu.xlsx")
