const fs = require('fs')
const papa = require('papaparse')
const train = fs.createReadStream('DataTrain_Tugas3_AI.csv')
const test = fs.createReadStream('DataTest_Tugas3_AI.csv')

const read_csv = async (data) => {
	return new Promise((resolve, reject) => {
		papa.parse(data, {
			delimiter: ',',
			complete: function(result) {
					resolve(result.data)
			}
		})
	})
}

const euclidean_distance = (
	point = [ '99', '-0.770781', '0.602787', '-0.555278', '-1.397452', '1.380693', '0' ],
	point2 = [ '99', '-0.770781', '0.602787', '-0.555278', '-1.397452', '1.380693', '0' ]
) => {

	const euclidean_score = (
		Math.pow(point[1] - point2[1], 2) + 
		Math.pow(point[2] - point2[2], 2) + 
		Math.pow(point[3] - point2[3], 2) + 
		Math.pow(point[4] - point2[4], 2) + 
		Math.pow(point[5] - point2[5], 2)
	)
	
	return euclidean_score
}

// memisahkan data untuk keperluan cross validation
const cross_validation_preparation = (dataset, howManyTest = 50) => {
	let crossValidationData = []
	
	let iTest = 0
	
	while (iTest !== dataset.length) {
		
		let dataTrain = [...dataset]
		let dataTest = dataTrain.splice(iTest, howManyTest)

		crossValidationData.push({ dataTrain: dataTrain, dataTest: dataTest })

		iTest += howManyTest
	}

	return crossValidationData
}


// Klasifikasi suatu point terhadap banyak titik DI DATA TRAIN
const classification = (
	point = [1,-1.608052,-0.377992,1.204209,1.313808,1.218265,1], 
	dataTrain,
	K
) => {
	const euclidean_scores = []
	
	let count_kelas = {
		'0': 0,
		'1': 0,
		'2': 0,
		'3': 0,
	}

	for (const data of dataTrain) {
		if (point[0] == data[0]) continue
		const euclidean_score = euclidean_distance(point, data)
		let kelas = data[data.length - 1]
		euclidean_scores.push({ score: euclidean_score, index: data[0], index2: point[0], kelas })
	}

	let sorted_scores = euclidean_scores.sort((a, b) => parseFloat(a.score) - parseFloat(b.score))
	let selectedScoresByK = sorted_scores.slice(0, K)
	
	for (const selected_point of selectedScoresByK) {
		count_kelas[selected_point['kelas']] += 1
	}

	let classes = Object.values(count_kelas);
	let maximum_score = Math.max(...classes)
	const fix_kelas = Object.keys(count_kelas).find(key => count_kelas[key] === maximum_score);
	return fix_kelas
}

const classificationManyPoints = (dataTrain, dataTest, K, { isTest } = { isTest: false}) => {
	const amountTest = dataTest.length
	let success_predict = 0
	let list_kelas = []
	
	for (const dTest of dataTest) {
		const predict_kelas = classification(dTest, dataTrain, K)
		list_kelas.push(predict_kelas)
		const valid_kelas = dTest[dTest.length - 1 ]
		success_predict += predict_kelas == valid_kelas ? 1 : 0
	}

	if (isTest) {
		const prepareData = dataTest.map((dt, index) => ({ 
			Index: dt[0], 
			X1: dt[1], 
			X2: dt[2], 
			X3: dt[3], 
			X4: dt[4], 
			X5: dt[5], 
			Y: list_kelas[index] 
		}))

		prepareData.shift(1)
		const csv = papa.unparse(prepareData, {	delimiter: "," })
		fs.writeFileSync('tebakan_Tugas3_AI.csv', csv)
	}

	if (!isTest) console.log({ success_predict });

	let accuracy = success_predict/amountTest
	return { accuracy, list_kelas }
}

const cross_validation = (splittedData, K) => {
	const manyAccuracy = []

	const amountSplittedData = splittedData.length

	let counter = 0
	
	for (const data of splittedData) {
		counter++
		console.log();
		console.log({counter});

		const { accuracy } = classificationManyPoints(data['dataTrain'], data['dataTest'], K)

		console.log({ accuracy });
		
		manyAccuracy.push(accuracy)
	}

	return manyAccuracy.reduce((a, b) => a + b, 0)/amountSplittedData
}

const main = async () => {
	const dataset = await read_csv(train)
	const DATA_TEST = await read_csv(test)

	dataset.shift()

	const K = 17
	const howManyTest = 50

	const data = cross_validation_preparation(dataset, howManyTest)
	const averageAccuracy = cross_validation(data, K)

	console.log({ averageAccuracy });

	const { list_kelas } = classificationManyPoints(dataset, DATA_TEST, K, { isTest: true })
}

main()