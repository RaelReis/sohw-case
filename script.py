import json

with open('pauta.json', 'r') as file:
    pauta = json.load(file)

# filtered = [item for item in pauta if item.remake == 'true' ]

# print(len(filtered))
# 
# with open('show-case.json', 'w') as write: