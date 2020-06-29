import json


def openjson(fullpath=str):
    with open(fullpath, 'r') as infile:
        jsonprofile = json.load(infile)
        return jsonprofile


def nom_map_from_profile(profile=json):
    chainidNameMap = {}
    for polymer in profile['polymers']:
        if len(polymer['nomenclature']) > 0:
            chainidNameMap[polymer['chainid']] = polymer['nomenclature'][0]
        else:
            chainidNameMap[polymer['chainid']] = polymer['chainid']
    return chainidNameMap
