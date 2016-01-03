### What about HTML entities

Typography-Fixer doesn't use HTML entities, it relies solely on unicode characters. The main reason is that, except for XML reserved characters (`<`, `>` and `&`), no one should no longer care about special characters when using a UTF8 charset. If you don't use UTF8 (seriously?) [there's a bunch of modules for that purpose](https://www.npmjs.com/search?q=html+entities).
The only exception is for the `&amp;` entity in html enhancement rules.
