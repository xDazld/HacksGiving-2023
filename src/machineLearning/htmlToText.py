import re

from bs4 import BeautifulSoup
import os
import csv
htmlfiles = [os.path.join(root, name)
             for root, dirs, files in os.walk("data")
             for name in files
             if name.endswith((".html", ".htm"))]
with open("dataComma.csv", "w", encoding="utf8", newline='') as myfile:
    writer = csv.writer(myfile, delimiter=',')
    writer.writerow(["Entries"])
    for htmlfile in htmlfiles:
        text = ""
        try:
            with open(htmlfile, encoding="utf8") as fp:

                soup = BeautifulSoup(fp.read(), 'html.parser')
                for string in soup.strings:

                    clean_string = ""
                    pattern = r'[^\w\s]|\d+|\b[a-zA-Z]+\b|\s'
                    # Find all matches in the text
                    matches = re.findall(pattern, string)
                    for match in matches:
                        if match is not []:
                            clean_string += match
                    text += clean_string
                    text = re.sub(r',', '', text)
                    text = re.sub(r'\s{2,}', ' ', text)
                    writer.writerow([text])
        except FileNotFoundError:
            print("unable to find " + str(htmlfile) + "\n")
    myfile.close()
#     soup = BeautifulSoup(fp.read(), 'html.parser')
#     for string in soup.strings:
#         text += string
# myfile.write(text)


# with open("test.txt", "a", encoding="utf8") as myfile:
#     for root, dirs, files in os.walk("data"):
#         for filename in files:
#             if filename.endswith((".html", ".htm")):
#                 print(filename)
                # text = ""
                # print(dirs)
                # with open(root +"\\" +dirs + "\\"+str(filename), encoding="utf8") as fp:
                #     soup = BeautifulSoup(fp.read(), 'html.parser')
                #     for string in soup.strings:
                #         text += string
                # myfile.write(text)



# soup = BeautifulSoup('<b class="boldest">Extremely bold</b>', 'html.parser')
# print(soup.string)




