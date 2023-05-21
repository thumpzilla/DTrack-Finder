
# Cell 1 ________________________________ Read the text file & Create pandas dataframe
import pandas as pd

# Assuming your data is in a file named 'data.txt'
df = pd.read_csv('DTRacks All 1200 DTracks.txt', sep='\t', header=0)

# Split the 'My Tag' column
df['My Tag'] = df['My Tag'].apply(lambda x: x.split(' / '))

df.head()  # Display the first few rows

#Cell 2 ________________________________ Covert Energy and Popularity tags to 1-10 scale
def create_energy_popularity_columns(df):
    translation_energy_from_6scale_to_10scale = {
        "": "-1",
        "1": "1",
        "1+2": "2",
        "2": "2",
        "2+3": "3",
        "3": "3",
        "3+4": "4",
        "4": "6",
        "4+5": "7",
        "5": "8",
        "5+6": "9",
        "6": "10"
    }
    
    def find_tag(tags, prefix):
        found_tags = sorted([tag for tag in tags if tag.startswith(prefix) and len(tag)==2], key=lambda x: int(x[1:]))
        if not found_tags:
            return None
        tag_key = '+'.join([tag[1:] for tag in found_tags])
        if prefix == 'E' and tag_key in translation_energy_from_6scale_to_10scale:
            return int(translation_energy_from_6scale_to_10scale[tag_key])
        elif prefix == 'P':  # Assuming there is a similar translation dict for 'P'
            return int(translation_energy_from_6scale_to_10scale[tag_key])
        else:
            return int(found_tags[-1][1:])

    df['Energy'] = df['My Tag'].apply(lambda tags: find_tag(tags, 'E'))
    df['Popularity'] = df['My Tag'].apply(lambda tags: find_tag(tags, 'P'))

    return df

# Apply the function to the DataFrame
df = create_energy_popularity_columns(df)

# Cell 3 __________________________________ Save the Dataframe as JSON

# Save the DF as a JSON (prepare for javascript)
df.to_json('DTRacks All 1200 DTracks.json', orient='records')

