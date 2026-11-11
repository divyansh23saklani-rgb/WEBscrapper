def flatten_schema(schema_data):
    def flatten(obj,parent_key = "",sep=""):
        items = []
        for k, v in obj.items():
            new_key = f"{parent_key}{sep}{k}" if parent_key else k
            if isinstance(v,dict):
                items.extend(flatten(v,new_key,sep =sep))
            elif isinstance(v,list):
                for i, item in enumerate(v):
                    if isinstance(item, dict):
                        items.extend(flatten(item,f"{new_key}[{i}]",sep = sep))
                    else:
                        items.append((f'{new_key}[{i}]',item))
            else:
                items.append((new_key,v))
        return items
    flat_texts = []
    for obj in schema_data:
        flat = flatten(obj)
        flat_text = '\n'.join(f"{k}: {v}" for k, v in flat)
        flat_texts.append(flat_text)
    return flat_texts