# Luma Prioritizer
This algorithm let's you generate a list of patients for appointment based on their past behavioral data. The fields considered in each of the instance of the patient record are age, location, acceptedOffers, canceledOffers and averageReplyTime.

To get the desired result
1. The data set is refined by a method called refineData, so as to exclude record instances that have missing fields such as averageReplyTime.
2. scoreAll is used to score each record instance that has all the fields required in the model. The scoreAll method individually calls methods such as scoreByAverageReplyTime, scoreByAge, scoreByLocation and scoreByAcceptedOffers, the resulting values from each of these methods sum up to 100% which is then converted to a score ranging from 1 t0 10.
3. arrange method is called with an argument of desc which means descending order, this method sort patient records in descending order, this means patients with great scores are at the top of the list.
4. Items collected by the refineData method in step 1 are randomly inserted into the resulting list of patients in step 3 with the help of a method called includePatientsWithIncompleteData .


### To run the algorithm

Clone the Repo ```git clone https://github.com/VictorMaria/luma-prioritizer.git```

Navigate into the directory ```cd luma-prioritizer```

Install dependences ```npm install``

Run tests ```npm test```

Run the build ```npm run build```

In the root directory of the repo, locate playground.ts file which already has Prioritizer class imported
You can uncomment the sample code and run ```npm run play``` or instantiate Prioritizer class with your own arguments, call
startPipeline method on the instance and run ```npm run play``` on the terminal to see the output.

```
const result = new Prioritizer(patientData, '-63.1150', '46.7110', 'averageReplyTime');
console.log(result.startPipeline());

Sample of an instance from the final output

{
    id: '174d1896-7da4-438a-8a85-e620a5f893bb',
    name: 'Maxime Emard',
    location: { latitude: '-75.9576', longitude: '-114.3718' },
    age: 77,
    acceptedOffers: 44,
    canceledOffers: 18,
    averageReplyTime: 1490,
    finalScore: 7.658064516129034
}

```


You can also call the individual methods on an instance of prioritizer to play around.
startPipeline method is just a method that calls other methods in a certain order to ensure the correct data is generated.


### distanceInKMBetweenTwoCoorindates method in the Utility class
It should be noted that this method calcuates the shortest distance between two coordinates and it does not take into consideration the additional distance the possible route between the coordinates may introduce.
    
