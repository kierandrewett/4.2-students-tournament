#!/usr/bin/env python3
import subprocess
import os
import sys

dir = sys.argv[1]
files = os.listdir(dir)

output = subprocess.check_output(["vt", "-k", os.environ.get("VT_TOKEN"), "scan", "file", "-o"] + list(map(lambda f: os.path.join(dir, f), files)))

lns = output.decode("utf-8").split('\n')

table = """| File name    | Results URL |
| ------------ | ------------- |
"""

print(lns)

for ln in lns:
    ln_split = ln.split(' ')

    if ln_split[0] == "":
        break

    table += f"| {os.path.basename(ln_split[0])} | [View result on VirusTotal]({ln_split[1]}) |\n"

with open("README.md", "r") as reader:
    readme_data = reader.read()

start = "<!-- VT:START -->"
end = "<!-- VT:END -->"

new_readme = readme_data.replace(readme_data[readme_data.find(start)+len(start):readme_data.rfind(end)], "")
new_readme = new_readme.replace("<!-- VT:START -->", f"<!-- VT:START -->\n{table}")

with open("README.md", "w") as writer:
    writer.write(new_readme)