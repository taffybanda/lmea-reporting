(function() {
  var shades = ['#042C53', '#0C447C', '#0077B6', '#185FA5', '#2a78d6', '#378ADD', '#5a9be3', '#85B7EB', '#9ec6ef', '#B5D4F4', '#cde2f7', '#E6F1FB'];
  var other = '#B4B2A9';

  function pal(n) { return shades.slice(0, n).concat([other]); }
  var data = {
    jt: {
      labels: ['Manager', 'Project Manager', 'Chief Executive Officer', 'Operations Manager', 'Office Manager', 'Sales Manager', 'Chief Financial Officer', 'Chief Operating Officer', 'Owner', 'Founder', 'President', 'District Manager', 'Other job titles'],
      c: [17, 12, 12, 10, 9, 6, 5, 5, 4, 4, 4, 4, 108],
      i: [112506, 71859, 70417, 34153, 50805, 37410, 14169, 12451, 16495, 16458, 14133, 4888, 505134]
    },
    ind: {
      labels: ['Technology, Information and Internet', 'Business Consulting and Services', 'IT Services and IT Consulting', 'Hospitality', 'Media and Telecommunications', 'Medical Practices', 'Food and Beverage Services', 'Non-profit Organizations', 'Construction', 'Wholesale', 'Transportation, Logistics and Storage', 'Retail', 'Other industries'],
      c: [32, 20, 15, 14, 14, 13, 10, 10, 9, 9, 9, 8, 37],
      i: [104736, 139654, 58970, 51944, 44945, 57382, 60589, 46402, 60207, 34589, 34183, 41683, 225616]
    },
    loc: {
      labels: ['New York City Metro', 'Greater Montreal', 'Greater Chicago', 'Greater Toronto', 'Denver Metro', 'Charlotte Metro', 'Greater Philadelphia', 'Detroit Metro', 'Other locations'],
      c: [15, 6, 5, 4, 4, 4, 3, 3, 156],
      i: [47561, 13636, 23578, 40860, 10365, 7377, 16152, 10169, 791202]
    }
  };
  
  var dark = document.documentElement.dataset.theme === 'dark' || (document.documentElement.dataset.theme !== 'light' && window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);
  var gap = dark ? '#0e1823' : '#ffffff';
  var charts = {};

  function legend(id, m) {
    var d = data[id],
      v = d[m],
      t = v.reduce(function(a, b) { return a + b }, 0),
      cols = pal(d.labels.length - 1);
    document.getElementById(id + '-legend').innerHTML = d.labels.map(function(l, k) { return '<div><i style="background:' + cols[k] + '"></i><span>' + l + '</span><em>' + v[k].toLocaleString() + ' (' + (v[k] / t * 100).toFixed(1) + '%)</em></div>'; }).join('');
  }
  if (!window.Chart) { Object.keys(data).forEach(function(id) { legend(id, 'c'); }); return; }
  Object.keys(data).forEach(function(id) {
    var d = data[id];
    charts[id] = new Chart(document.getElementById(id), {
      type: 'pie',
      data: { labels: d.labels, datasets: [{ data: d.c.slice(), backgroundColor: pal(d.labels.length - 1), borderColor: gap, borderWidth: 2 }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: function(c) { var t = c.dataset.data.reduce(function(a, b) { return a + b }, 0); return ' ' + c.label + ': ' + c.parsed.toLocaleString() + ' (' + (c.parsed / t * 100).toFixed(1) + '%)'; } } } } }
    });
    legend(id, 'c');
  });
  document.querySelectorAll('.toggle button').forEach(function(b) {
    b.addEventListener('click', function() {
      var id = b.dataset.chart,
        m = b.dataset.m;
      charts[id].data.datasets[0].data = data[id][m].slice();
      charts[id].update();
      legend(id, m);
      b.parentNode.querySelectorAll('button').forEach(function(x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
    });
  });
})();