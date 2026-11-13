<?php

return [
    // Struktur sub-checklist: identik dengan versi Cloudflare Worker.
    'statuses' => ['Sudah Diisi', 'Perlu Tindak Lanjut'],
    'kinds' => [
        'Panel Utama Listrik' => [
            ['group' => 'Checklist KWH Listrik', 'items' => ['PF', 'Cos Q', 'Daya', 'Load (KVA)', 'WBP', 'WBP 1', 'LWBP 1', 'Total KWh', 'KVARH', 'Total Load', 'Voltage R', 'Voltage S', 'Voltage T', 'Arus 1 R', 'Arus 2 S', 'Arus 3 T', 'WBP 2', 'LWBP 2']],
            ['group' => 'Checklist PDTR Incoming Trafo 1', 'items' => ['PDTR 1 L1', 'PDTR 1 L2', 'PDTR 1 L3', 'Temperatur ruangan', 'Stand KWh meter', 'Ampere R', 'Ampere S', 'Ampere T', 'Volt PH-N', 'Volt PH-PH', 'Cos Q', 'Frekuensi (Hz)', 'Capacitor Bank 1 Status', 'Current', 'THD', 'Set CosQ', 'C/K', 'Sensitivity', 'Recon time', 'Rated steps', 'Switch prog', 'THD Limit']],
            ['group' => 'Checklist PDTR Incoming Trafo 2', 'items' => ['PDTR 2 L1', 'PDTR 2 L2', 'PDTR 2 L3', 'Temperatur ruangan', 'Stand KWh meter', 'Ampere R', 'Ampere S', 'Ampere T', 'Volt PH-N', 'Volt PH-PH', 'Cos Q', 'Frekuensi (Hz)', 'Capacitor Bank 2 Status', 'Current', 'THD', 'Set CosQ', 'C/K', 'Sensitivity', 'Recon time', 'Rated steps', 'Switch prog', 'THD Limit']],
            ['group' => 'Checklist Trafo', 'items' => ['Oil Temp Trafo 1', 'Oil level Trafo 1', 'Oil Temp Trafo 2', 'Oil level Trafo 2']],
            ['group' => 'Checklist Incoming PLN B1', 'items' => ['V avg', 'I avg', 'Ampere R', 'Ampere S', 'Ampere T', 'P TOTAL KW', 'E DELTA GWH', 'Frekuensi (Hz)', 'Cos Q']],
        ],
        'Monitoring Ruang Pompa' => [
            ['group' => 'Checklist Pompa Transfer', 'items' => ['Stand KWh', 'Ampere R', 'Ampere S', 'Ampere T', 'Volt PH-N', 'Volt PH-PN']],
            ['group' => 'Checklist Status pompa (A/M)', 'items' => ['Pressure Transfer 1', 'Pressure Transfer 2', 'Status pompa transfer', 'Status Jockey Pump', 'Status Electrik Pump', 'Status Diesel Pump', 'Press. Gauge Header', 'Press. Gauge Jockey pump', 'Press. Gauge Electrik pump', 'Press. Gauge Diesel pump', 'Deep Well', 'Treatment Pump (TP) 1', 'Treatment Pump (TP) 2']],
            ['group' => 'Checklist Filter pompa', 'items' => ['Pressure Carbon Filter', 'Pressure Sand Filter', 'Kualitas Air', 'Back Wash (0.5 BAR)']],
            ['group' => 'Checklist Supply air', 'items' => ['Level Recycle 1 (B3)', 'Level Recycle 2 (B3)', 'Level water tank 1 (B3)', 'Level water tank 2 (B3)', 'Level ground tank 1 (LG)', 'Level ground tank 2 (LG)']],
            ['group' => 'Checklist Calfa Bac (TDS)', 'items' => ['conductivity', 'water temperature', 'upper limit', 'lower limit']],
            ['group' => 'Checklist Booster Pump B3', 'items' => ['Status Booster pump', 'Press. Gauge Booster', 'Press. SP High', 'Press. SP low', 'Setting Press Booster', 'Press. Gauge reser Booster']],
            ['group' => 'Checklist Booster Pump P8', 'items' => ['Status Booster pump', 'Press. Gauge Booster', 'Hour Meter Booster 1', 'Hour Meter Booster 2', 'level roof tank P8', 'exfansen tank']],
            ['group' => 'Checklist Booster Pump 25', 'items' => ['Status Booster pump', 'Press. Gauge Booster', 'level roof tank 1 lt 25', 'level roof tank 2 lt 25', 'Status wlc roof tank 1', 'Status wlc roof tank 2', 'Ampere', 'Voltage']],
            ['group' => 'Checklist Booster Pump Rooftop', 'items' => ['Status Booster pump', 'Press. Gauge Booster', 'Press. SP High', 'Press. SP low', 'Setting Press Booster', 'Press. Gauge reser Booster']],
            ['group' => 'Checklist Stand Meter PAM', 'items' => ['Stand Meter PAM', 'Total pemakaian PAM']],
        ],
        'Chiller York Centrifugal' => [
            ['group' => 'Checklist Evap Chiller', 'items' => ['LEAVING CHILLER TEMP (°C)', 'RETURN CHILLER TEMP (°C)', 'EVAP PRESS (kPaG)', 'EVAP TEMP (°C)', 'EVAP SAT TEMP (°C)', 'EVAP SMALL TEMP DIFF (°C)', 'INLET PRESS (kg/cm²)', 'OUTLET PRESS (kg/cm²)']],
            ['group' => 'Checklist Condenser Chiller', 'items' => ['LEAVING COND TEMP (°C)', 'RETURN COND TEMP (°C)', 'COND PRESS (kPaG)', 'COND SAT TEMP (°C)', 'COND SMALL TEMP DIFF (°C)', 'INLET PRESS (kg/cm²)', 'OUTLET PRESS (kg/cm²)']],
            ['group' => 'Checklist Compresor Chiller', 'items' => ['OIL PRESS (kg/cm²)', 'DISCHARGE TEMP (°C)', 'COMP OIL LEVEL (H/M/L)', 'DISCHARGE SUPERHEAT (°C)', 'SURGE AVOID COUNT']],
            ['group' => 'Checklist Oil Sump Chiller', 'items' => ['OIL SUMP TEMP (°C)', 'OIL PRESS (kPaG)', 'OIL SETPOINT (°C)', 'OIL PUMP DRIVE COM FREQ']],
            ['group' => 'Checklist Motor Chiller', 'items' => ['OUTPUT VOLTAGE R', 'OUTPUT VOLTAGE S', 'OUTPUT VOLTAGE T', 'OUTPUT CURRENT PHASE A', 'OUTPUT CURRENT PHASE B', 'OUTPUT CURRENT PHASE C', 'VSD HEATING TEMP A', 'VSD HEATING TEMP B', 'VSD HEATING TEMP C']],
            ['group' => 'Checklist Setpoint Chiller', 'items' => ['TEMP °C', 'CURENT LIMIT %', 'RUNNING HOUR', 'FULL LOAD AMP', 'NUMBER OF STARTS']],
        ],
    ],
];
