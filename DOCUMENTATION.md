**** Elemek pozícionálása


**** Struktúrák

**Walls
Description: Ez egy collection Wall objektumokkal. Ahány elem van a collection-ben, annyi fala van a szobának. /generate-level endpoint visszatérési értékének egyik legfontosabb eleme

**Wall
Description: Falat leíró struktúra
Properties:
    color: hexadecimális string, a fal színét írja le. Később ez kép lesz
    objects: Egy olyan object, ami különböző típusú interkatálható elemekkel van feltöltve. Ez írja le hogy milyen kattintható elemek vannak a falon

** Exit
Description: Olyan interaktálható elem ami a játák végét jelenti.
Properties:
    position: Adott falon való elhelyezkedése. Lásd "Elemek pozícionálása". 
    keeyId: Az elemet nyitó kulcs. Ha ez az elem a játékosnál van kiválasztva, akkor az exit státusza megváltozik CLOSED-ról OPEN-re.
    sprites: Sprite collection, amilyen státuszban az objektum áll, annak megfelelő sprite kerül lerenderelésre. Default státusz a CLOSED.

** Pickables
Description: Olyan interaktálható elemek halmaza amit a játékos fel tud venni, az inventoryban ki tud választani és használni tudja. 

** Pickable
Description: Felvehető elem, amit a játékos kiválasztva interakciókat csinálhat más fali objektumokkal egyszer vagy többször, valamint kombinálhat más már felvett felvehető elemmel hogy új elemet állíthasson elő. Mérete mindig csak kicsi lehet.
Properties:
    position: Adott falon való elhelyezkedése. Lásd "Elemek pozícionálása". 
    name: Az elem neve, amit a játékus felvétel után el tud olvasni
    sprite: A felvehető elem Sprite grafikájának leírása.

** Sptrite
Description: A játékban megjelenítendő objektumokhoz tartozó képeknek metaadata.
Properties:
    id: felvehető elem uuid értéke
    width: Kép szélessége pixel pontokban megadva
    height: Kép magassága pixel pontokban megadva
    name: Kép file neve, amit a kliens a kép lekérdezésére használ a "/images/<filename>" route-ot használva
    state: Ha egy objektumhoz több Sprite is tartozik, ez alapján határozzuk meg mikor melyiket kell megjeleníteni. 

https://excalidraw.com/#room=8a07987b74f747d4840c,GJjou97EQhK7gODYV_WJWA