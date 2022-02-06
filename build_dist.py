# build_dist.py

from bs4 import BeautifulSoup
from pathlib import Path
import base64
import sys
import validators

original_html_text = Path(sys.argv[1]).read_text(encoding="utf-8")
soup = BeautifulSoup(original_html_text)

# Find link tags. example: <link rel="stylesheet" href="css/somestyle.css">
for tag in soup.find_all('link', href=True):
    if tag.has_attr('href'):
        file_text = Path(tag['href']).read_text(encoding="utf-8")

        # remove the tag from soup
        tag.extract()

        # insert style element
        new_style = soup.new_tag('style')
        new_style.string = file_text
        soup.html.head.append(new_style)


# Find script tags. example: <script src="js/somescript.js"></script>
for tag in soup.find_all('script', src=True):
    if tag.has_attr('src'):
        file_text = None
        if validators.url(tag['src']):
            import requests
            file_text = requests.get(tag['src'], allow_redirects=True).content.decode('utf-8')
        else:
            file_text = Path(tag['src']).read_text()

        # remove the tag from soup
        tag.extract()

        # insert script element
        new_script = soup.new_tag('script')
        new_script.string = file_text
        soup.html.body.append(new_script)

# Find image tags.
for tag in soup.find_all('img', src=True):
    if tag.has_attr('src'):
        file_content = Path(tag['src']).read_bytes()

        # replace filename with base64 of the content of the file
        base64_file_content = base64.b64encode(file_content)
        tag['src'] = "data:image/png;base64, {}".format(base64_file_content.decode('ascii'))

# Save onefile
with open(f"dist/{sys.argv[1]}", "w", encoding="utf-8") as outfile:
    outfile.write(str(soup))
