import os
import pandas as pd
import json

#loop through each csv file in the directory
for filename in os.listdir(os.getcwd()):


    # Check if the file is a CSV file
    if not filename.endswith('.csv'):
        continue

    # Read the CSV file into a pandas DataFrame
    df = pd.read_csv(filename)

    # get the name of the file without the extension
    filename = filename[:-4]

    # Convert the DataFrame to a JSON object
    json_data = df.to_json(orient='records')

    # Define the relative paths from the current directory
    source_relative_path = '../../src/data'
    dest_relative_path = '../../dist/data'

    # Get the absolute paths from the relative paths
    current_directory = os.getcwd()
    source_path = os.path.abspath(os.path.join(current_directory, source_relative_path))
    dest_path = os.path.abspath(os.path.join(current_directory, dest_relative_path))

    # Save the JSON data to a file at the source
    source_file_path = os.path.join(source_path, filename + '.json')
    os.makedirs(source_path, exist_ok=True)  # Create the source directory if it doesn't exist
    with open(source_file_path, 'w') as json_file:
        json_file.write(json_data)

    # Save the JSON data to a file at the destination
    dest_file_path = os.path.join(dest_path, filename + '.json')
    os.makedirs(dest_path, exist_ok=True)  # Create the destination directory if it doesn't exist
    with open(dest_file_path, 'w') as json_file:
        json_file.write(json_data)
