function ts_point_compare(point1, point2){
    // Comparison function for time series datapoint with x=Date, y=Value
    return Date.parse(point1.x) - Date.parse(point2.x);
}

function format_date(date){
    let dd_mm_yyyy = date.split('-') 
    return `${dd_mm_yyyy[2]}/${dd_mm_yyyy[1]}/${dd_mm_yyyy[0]}`
}

function process_time_series(ts){
    let data = []
    for (const [key, value] of Object.entries(ts)) {
        if (value != null) {
            data.push({
                x: format_date(key),
                y: parseFloat(value)
            })
        }
    }
    console.log(data)
    data = data.sort(ts_point_compare);
    return data
}

export {process_time_series};