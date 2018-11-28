const fs = require('fs')
const papa = require('papaparse')
const train = fs.createReadStream('DataTrain_Tugas3_AI.csv')
const test = fs.createReadStream('DataTest_Tugas3_AI.csv')
const hasil = fs.createWriteStream('tebakan_Tugas3_AI.csv')


const read_csv = async () => {
    return new Promise((resolve, reject) => {
        papa.parse(train, {
            delimiter: ',',
            complete: function(result) {
                resolve(result.data)
            }
        })
    })
}

const classify_list = (test_list, train_list)=>{
    tested = []
    for (let index = 1; index < test_list.length; index++) {
        console.log('Processing test case #', index);
        tested.append(test[index])
        tested[tested.length-1][test.length-1] = classify(test_list, train_list)
    }
    return tested
}

const classify = (test, train_list) => {
    distance = []
    for (const train of train_list) {
        distance.append([train[train.length-1], calculate_distance(test, train)])
    }
    sorted_distance //sort hasil
    return get_class(sorted_distance)
}

const calculate_distance = (test, train) => {
    return Math.sqrt( Math.pow(test[1]-train[1], 2) + Math.pow(test[2]-train[2], 2) + Math.pow(test[3]-train[3], 2) + Math.pow(test[4]-train[4], 2) + Math.pow(test[5]-train[5], 2) )
}

const get_class = (sorted_distance) => {
    var Y = [0, 0]
    trimmed = sorted_distance[0:k]

}

const main = async () => {
    let dataTrain
    dataTrain = await read_csv()
    console.log({ dataTrain })
}

main()