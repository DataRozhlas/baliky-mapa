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
              console.log(e);
            });
            spot.on('mouseout', function(e) {
              console.log('out');
            });
            spot.on('click', function(e) {
              console.log(e);
            });
        };
        

        console.log(tracking[pkg_id][day])
    }
})