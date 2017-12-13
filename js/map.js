var packages = {
  "DR0305764330X": { "route":"Jeseník – Čechtice ", "provider":"Česká pošta"},
  "DR0269355998X": { "route":"Čechtice – Jeseník", "provider":"Česká pošta"},
  "40970017769": { "route":"Jeseník – Čechtice", "provider":"PPL"},
  "41270011889": { "route":"Čechtice – Jeseník", "provider":"PPL"},
  "DR0239495603X": { "route":"Praha – Brno", "provider":"Česká pošta"},
  "DR0275736681X": { "route":"Brno – Praha ", "provider":"Česká pošta"},
  "40170028759": { "route":"Praha – Brno", "provider":"PPL"},
  "40670023798": { "route":"Brno – Praha ", "provider":"PPL"},
  "DR0282263514X": { "route":"Teplice – Tábor ", "provider":"Česká pošta"},
  "DR0263646516X": { "route":"Tábor – Teplice ", "provider":"Česká pošta"},
  "40211350106": { "route":"Tábor – Teplice ", "provider":"PPL"},
  "40470008020": { "route":"Teplice – Tábor", "provider":"PPL"},
  "DR0298690682X": { "route":"Klatovy – Ostrava ", "provider":"Česká pošta"},
  "DR0300002852X": { "route":"Ostrava – Klatovy ", "provider":"Česká pošta"},
  "40350006800": { "route":"Klatovy – Ostrava ", "provider":"PPL"},
  "40070005249": { "route":"Ostrava – Klatovy ", "provider":"PPL"}
};

var map = L.map('map').setView([49.7417517, 15.3350758], 8);

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

function howLong(from, to) {
    from = from.split('.')
    to = to.split('.')

    var start = new Date();
    var end = new Date();

    start.setFullYear(from[2])
    start.setMonth(from[1])
    start.setDate(from[0])

    end.setFullYear(to[2])
    end.setMonth(to[1])
    end.setDate(to[0])

    return (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
};

function getColor(duration) {
    if (duration <= 1) {return '#2c7bb6';} else
    if (duration <= 2) {return '#abd9e9';} else
    if (duration <= 3) {return '#ffffbf';} else
    if (duration <= 4) {return '#fdae61';} else
    {return '#d7191c'}
};

function makeTooltip(args) {
    if (typeof args == 'undefined') {
        document.getElementById('tooltip').innerHTML = 'Vyberte trasu balíku.';
    } else {
        document.getElementById('tooltip').innerHTML = 'Balík ' + packages[args.pkg_id].route + ' (' + packages[args.pkg_id].provider + ')<br>Dní v přepravě: ' 
        + args.duration;
    };
};

Object.keys(tracking).forEach(function(pkg_id) {
    var linePnts = [];
    var duration = howLong(tracking[pkg_id][Object.keys(tracking[pkg_id]).length - 1]['date'], tracking[pkg_id][0]['date']);
    var color = getColor(duration)
    for (var day in tracking[pkg_id]) {
        var v = tracking[pkg_id][day];
        if (!(isNaN(v['x']))) {
            var ll = [v.y + Math.random() / 30, v.x + Math.random() / 30]
            linePnts.push(ll);
            var spot = L.circleMarker(ll, {
                radius: 5,
                weight: 0.5,
                color: '#636363',
                opacity: 1,
                fillColor: color,
                fillOpacity: 0.75,
                //zIndex: rad,
                place_name: v.place_name,
                status: v.status,
                date: v.date,
                tracking: v.tracking,
                psc: v.psc
            });

            spot.addTo(map);
            spot.on('mouseover', function(e) {
                makeTooltip(e.target.options);
            });
            spot.on('mouseout', function(e) {
                makeTooltip();
            });
            spot.on('click', function(e) {
                makeTooltip(e.target.options);
            });
        };
        
        var line = L.polyline(linePnts, {
            color: color,
            weight: 3,
            opacity: 0.25,
            pkg_id: pkg_id,
            duration: duration
        });
        line.addTo(map);

        line.on('mouseover', function(e) {
            makeTooltip(e.target.options);
        });
        line.on('mouseout', function(e) {
            makeTooltip();
        });
        line.on('click', function(e) {
            makeTooltip(e.target.options);
        });
    }
})