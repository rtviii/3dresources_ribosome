


# Notes

- 90% of clustering takes place between 2 and 4 angstrom.

- Excluding  mitochondria and chloroplasts.
- 90% nomenclature coverage except for underdetermined molecules. The rest 10% are  ambiguous pfam groups and such.


___

#### So it goes:

1. Get your ```.cif``` model ready.
2. Pipe your rnas from post-pfam *pdbid* profile and construct a neighbour tree for a given **GLOBAL PARAMETER** *radius* excluding those *rna*s.
3. Reduce neighbour tree to clusters of neighbours. **HAS TO BE MADE RECURSIVE**.
4. Save to file.
5. Iterate (1-4) for radii in range 1.5-8 angstrom to see full range of clustering.



### Arbitrary Choices:

- Particular radius-sample for each of the species when constructing inside-kingdom correlation matrices(different tightness across species)
- Ambiguous PFAM groups culled

### More Potential Targets:
Tetrahymena thermophila

60S•eIF6complex[Klingeetal.2011])andyeast
(80S[Ben-Shemetal.2011])

species were solved by cryo-
EM in various states of translation, at close
to atomic resolutions: canine (Voorhees and
Hegde 2016), porcine (Voorhees et al. 2013,
2014), and human (Khatter et al. 2015).

A number of studies focused on translation
mediated by IRESs from viruses on ribosomes
fromyeast (Fernándezetal.2014;Abeyrathneet
al. 2016; Murray et al. 2016), rabbit (Hashem et
al. 2013c; Yamamoto et al. 2014, 2015; Muhs
et al. 2015), and human (Quade et al. 2015).

Trypanosoma cruzi, Trypanosoma
brucei,andLeishmania.   cruziat12 Å[Gaoetal.2005]andforT.brucei
at 5.5 Å [Hashem et al. 2013a]) 

d Leishmania donovani at 2.8 Å
(Shalev-Benami et al. 2016), as well as 80S ribo-
somesofL.donovaniat2.9 Å(Zhangetal.2016)

Mancera-Martínez
et al. 2017

Fernández et al. (2013)

s with the mammalian eIF3
core’s ribosomal contacts, eS1, eS26, and eS27
Kluyveromyces lactis 
 5v93
look for alterantive structures in pfam entries for a family!
