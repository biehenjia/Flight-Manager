"""
Author: Joshua Goudy
Date: 2025-11-05
Use: takes a municipality name and returns the idenitifiers
        of nearby airports.
"""

import re
import string
import pandas as pd

# import dataset and define types of airports to include
all_airports = pd.read_csv(
    "https://github.com/Vivi-933/Flight-Manager/raw/main/filtered_airports.csv")
airport_types = ["small_airport", "medium_airport", "large_airport"]


def cleaning(df, types):
    """filter airports by type"""
    return df.loc[df["type"].isin(types) & (df['iata_code'].isna() == False )]


def strip_text(text):
    """convert city names to lowercase string with only letters"""
    if pd.isna(text):
        return ""
    return ''.join(ch.lower() for ch in text if ch not in string.punctuation and not ch.isspace())


def get_city(city):
    """prompt user for city and/or normalize input"""
    if city is None:
        city = input("City: ")
    city = re.sub(r'[^a-zA-Z]', '', city).lower()
    return city


def find_ident(city, airports):
    """find airport identifiers for a given city"""
    nearby_airports = airports[airports["stripped_city"] == city]
    return nearby_airports["iata_code"].tolist()

def main(city=None):
    """run program"""
    # clean dataset
    airports = cleaning(all_airports, airport_types)
    # strip municipality column
    airports["stripped_city"] = airports["municipality"].apply(strip_text)
    city = get_city(city)
    return find_ident(city, airports)


