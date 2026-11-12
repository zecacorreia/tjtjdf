#!/usr/bin/env python3
"""Copia resultados-todas-execucoes.csv para a aba "Todas as execuções" da planilha (recria a aba).
Uso: python3 csv-para-planilha.py [planilha.xlsx] [resultados.csv]   (requer openpyxl)
Depois, abra e salve no Excel (ou rode o recálculo) para atualizar os valores em cache das fórmulas das outras abas."""
import csv, sys, os
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.utils import get_column_letter
here = os.path.dirname(os.path.abspath(__file__)); docs = os.path.join(here, '..', 'docs')
xlsx = sys.argv[1] if len(sys.argv) > 1 else os.path.join(docs, 'planilha-abordagem-A-2026-11-02.xlsx')
src = sys.argv[2] if len(sys.argv) > 2 else os.path.join(docs, 'resultados-todas-execucoes.csv')
rows = list(csv.reader(open(src, encoding='utf-8-sig'), delimiter=';'))
wb = openpyxl.load_workbook(xlsx)
NAME = 'Todas as execuções'
if NAME in wb.sheetnames: del wb[NAME]
ws = wb.create_sheet(NAME, index=wb.sheetnames.index('Tempos') if 'Tempos' in wb.sheetnames else None)
ws['A1'] = 'Todas as execuções (uma linha por pasta, sample e repetição). Gerada por exportar-planilha.js; não edite à mão.'
ws['A1'].font = Font(name='Arial', bold=True, size=12)
hdr, body = rows[0], rows[1:]
num = {'rep','temperatura','rodadas','tokens_entrada','tokens_resposta','tokens_raciocinio','tokens_total','latencia_ms_resposta','tentativas_transitorias','jsweet_segundos_total','jsweet_ms'}
for j, h in enumerate(hdr, 1):
    c = ws.cell(3, j, h); c.font = Font(name='Arial', bold=True, color='FFFFFF'); c.fill = PatternFill('solid', fgColor='2F4B6E'); c.alignment = Alignment(wrap_text=True, vertical='center')
for i, r in enumerate(body, 4):
    for j, v in enumerate(r, 1):
        if v != '' and hdr[j-1] in num:
            try: v = float(v.replace(',', '.')); v = int(v) if v == int(v) and hdr[j-1] != 'jsweet_segundos_total' else v
            except ValueError: pass
        c = ws.cell(i, j, v if v != '' else None); c.font = Font(name='Arial', size=10)
widths = {'pasta':22,'data_execucao':17,'modelo':26,'valida':20,'sample':44,'js_sha256':20,'observacao':44}
for j, h in enumerate(hdr, 1): ws.column_dimensions[get_column_letter(j)].width = widths.get(h, 14)
ws.freeze_panes = 'A4'; ws.auto_filter.ref = f"A3:{get_column_letter(len(hdr))}{3+len(body)}"
wb.save(xlsx); print(f'{len(body)} linhas na aba "{NAME}" de {xlsx}')
