import { LDDict } from "ldaccess/LDDict";

import { KVL } from 'ldaccess/KVL';

let testData: KVL[] =  [
    { key: "IstNeuprojekt", ldType: LDDict.Boolean, value: true },
    { key: "AnzahlPersonenTage", ldType: LDDict.Double, value: 133.7 },
    { key: "AnzahlPersonen", ldType: LDDict.Integer, value: 3 },
    { key: "IstRemoteMöglich", ldType: LDDict.Boolean, value: true },
    { key: "StartDatum", ldType: LDDict.Date, value: new Date("2017-03-04") },
    { key: "EndDatum", ldType: LDDict.Date, value: new Date() },
    { key: "AdresseKunde", ldType: LDDict.Text, value: "Neue Straße 42, 123456 Schönestadt" },
];

export default testData;
