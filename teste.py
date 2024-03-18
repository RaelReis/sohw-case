import json

with open('pauta.json', 'r') as file:
    pautaData = json.load(file)


for data in pautaData:
    data["validated"] = False
    data["remake"] = False

with open('save.json', 'w') as file_to_save:
    json.dump(pautaData, file_to_save,indent=4)
    