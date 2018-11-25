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

const euclidean_distance = (
	points = [ '99', '-0.770781', '0.602787', '-0.555278', '-1.397452', '1.380693', '0' ],
	points2 = [ '99', '-0.770781', '0.602787', '-0.555278', '-1.397452', '1.380693', '0' ]
) => {
	points.shift()
	points2.shift()

	const euclidean_score = (
		Math.pow(points[0] - points2[0], 2) + 
		Math.pow(points[1] - points2[1], 2) + 
		Math.pow(points[2] - points2[2], 2) + 
		Math.pow(points[3] - points2[3], 2) + 
		Math.pow(points[4] - points2[4], 2)
	)
	
	return euclidean_score
}

const main = async () => {
	const dataset = await read_csv()

	const euclidean_scores = []

	for (const data of dataset) {
		// console.log({ score: euclidean_distance() });


		const euclidean_score = euclidean_distance()

		
		
	}


	

}

main()
