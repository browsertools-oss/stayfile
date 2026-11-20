import re
with open('src/site.ts', 'r') as f:
    content = f.read()

slugs = re.findall(r"slug: '([^']+)'", content)
print('Total slugs:', len(slugs))

slugs_with_more = []
for slug in slugs:
    idx = content.find("slug: '" + slug + "',")
    if idx != -1:
        chunk = content[idx:idx+500]
        if 'more: {' in chunk:
            slugs_with_more.append(slug)

print('Slugs with more:', len(slugs_with_more))
slugs_without = [s for s in slugs if s not in slugs_with_more]
print('Slugs without more:', len(slugs_without))
for s in slugs_without:
    print('  ' + s)