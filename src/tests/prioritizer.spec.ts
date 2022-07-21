import 'mocha';
import { expect } from 'chai';
import Prioritizer from '../prioritizer';
import { patientsMockData, patientsMockData2 } from './data';
import { standardDistance } from '../prioritizer/configurables';
import { IPatient } from '../prioritizer/model';

describe('Prioritizer methods', () => {
  describe('calculateAverage', () => {
    const somePatients = new Prioritizer(
      patientsMockData2,
      '-63.1150',
      '46.7110',
      'averageReplyTime'
    );
    it('This should return the average of a given numerical field', () => {
      const result = somePatients.calculateAverage(somePatients.field);
      expect(result).to.equal(2683.2);
    });
  });
  describe('scoreByAge', () => {
    const somePatients = new Prioritizer(
      [
        {
          id: '541d25c9-9500-4265-8967-240f44ecf723',
          name: 'Samir Pacocha',
          location: { latitude: '46.7110', longitude: '-63.1150' },
          age: 46,
          acceptedOffers: 49,
          canceledOffers: 92,
        },
        {
          id: '541d25c9-9500-4265-8967-240f44ecf729',
          name: 'Samon Pacocha',
          location: { latitude: '46.7110', longitude: '-63.1150' },
          age: 75,
          acceptedOffers: 49,
          canceledOffers: 92,
        },
      ],
      '-63.1150',
      '46.7110',
      'averageReplyTime'
    );
    it('This should return a score of 5% for a 46 year old patient', () => {
      const result = somePatients.scoreByAge(somePatients.patients[0].age);
      expect(somePatients.patients[0].age).to.equal(46);
      expect(result).to.equal(5);
    });
    it('This should return a score of 10% for a 75 year old patient', () => {
      const result = somePatients.scoreByAge(somePatients.patients[1].age);
      expect(somePatients.patients[1].age).to.equal(75);
      expect(result).to.equal(10);
    });
  });

  describe('scoreByAcceptedOffers', () => {
    const somePatients = new Prioritizer(
      [
        {
          id: '541d25c9-9500-4265-8967-240f44ecf723',
          name: 'Samir Pacocha',
          location: { latitude: '46.7110', longitude: '-63.1150' },
          age: 46,
          acceptedOffers: 90,
          canceledOffers: 10,
        },
        {
          id: '541d25c9-9500-4265-8967-240f44ecf729',
          name: 'Samon Pacocha',
          location: { latitude: '46.7110', longitude: '-63.1150' },
          age: 75,
          acceptedOffers: 12,
          canceledOffers: 60,
        },
      ],
      '-63.1150',
      '46.7110',
      'averageReplyTime'
    );

    it('This should return a higher fraction of 60% for a patient with more accepted offers', () => {
      const result = somePatients.scoreByAcceptedOffers(
        somePatients.patients[0].acceptedOffers,
        somePatients.patients[0].canceledOffers
      );
      expect(result).to.greaterThan(30);
    });
    it('This should return a lower fraction of 60% for a patient with less accepted offers', () => {
      const result = somePatients.scoreByAcceptedOffers(
        somePatients.patients[1].acceptedOffers,
        somePatients.patients[1].canceledOffers
      );
      expect(result).to.lessThan(30);
    });
  });

  describe('scoreByAverageReplyTime', () => {
    const somePatients = new Prioritizer(
      [
        {
          id: '541d25c9-9500-4265-8967-240f44ecf723',
          name: 'Samir Pacocha',
          location: { latitude: '46.7110', longitude: '-63.1150' },
          age: 46,
          acceptedOffers: 49,
          canceledOffers: 92,
          averageReplyTime: 2598,
        },
        {
          id: '41fd45bc-b166-444a-a69e-9d527b4aee48',
          name: 'Bernard Mosciski',
          location: { latitude: '-81.0341', longitude: '144.9963' },
          age: 21,
          acceptedOffers: 95,
          canceledOffers: 96,
          averageReplyTime: 1908,
        },
        {
          id: '90592106-a0d9-4329-8159-af7ce4ba45ad',
          name: 'Theo Effertz',
          location: { latitude: '-35.5336', longitude: '-25.2795' },
          age: 67,
          acceptedOffers: 69,
          canceledOffers: 24,
          averageReplyTime: 3452,
        },
        {
          id: 'b483afb8-2ed7-4fd2-9cd6-c1fd7071f19f',
          name: 'Mathew Halvorson',
          location: { latitude: '-75.6334', longitude: '-165.8910' },
          age: 26,
          acceptedOffers: 80,
          canceledOffers: 22,
          averageReplyTime: 2315,
        },
        {
          id: '1ba1b882-6516-4e54-a1ef-453bb3137d02',
          name: 'Mossie Larkin',
          location: { latitude: '77.5235', longitude: '175.3549' },
          age: 86,
          acceptedOffers: 62,
          canceledOffers: 95,
          averageReplyTime: 3143,
        },
      ],
      '-63.1150',
      '46.7110',
      'averageReplyTime'
    );
    const averageReplyTime = somePatients.calculateAverage(somePatients.field);
    it('This should return 20% for a patient with a reply time less than or equal to the average reply time', () => {
      const result = somePatients.scoreByAverageReplyTime(
        somePatients.patients[1],
        somePatients.field
      );
      expect(result).to.be.equal(20);
    });
    it('This should return 10% for a patient with a reply time greater than the average reply time', () => {
      const result = somePatients.scoreByAverageReplyTime(
        somePatients.patients[somePatients.patients.length - 1],
        somePatients.field
      );
      expect(result).to.be.equal(10);
    });
  });

  describe('scoreByDistance', () => {
    const somePatients = new Prioritizer(
      [
        {
          id: '541d25c9-9500-4265-8967-240f44ecf723',
          name: 'Samir Pacocha',
          location: { latitude: '46.7110', longitude: '-63.1150' },
          age: 46,
          acceptedOffers: 49,
          canceledOffers: 92,
          averageReplyTime: 2598,
        },
        {
          id: '41fd45bc-b166-444a-a69e-9d527b4aee48',
          name: 'Bernard Mosciski',
          location: { latitude: '-81.0341', longitude: '144.9963' },
          age: 21,
          acceptedOffers: 95,
          canceledOffers: 96,
          averageReplyTime: 1908,
        },
        {
          id: '90592106-a0d9-4329-8159-af7ce4ba45ad',
          name: 'Theo Effertz',
          location: { latitude: '-35.5336', longitude: '-25.2795' },
          age: 67,
          acceptedOffers: 69,
          canceledOffers: 24,
          averageReplyTime: 3452,
        },
        {
          id: 'b483afb8-2ed7-4fd2-9cd6-c1fd7071f19f',
          name: 'Mathew Halvorson',
          location: { latitude: '-75.6334', longitude: '-165.8910' },
          age: 26,
          acceptedOffers: 80,
          canceledOffers: 22,
          averageReplyTime: 2315,
        },
        {
          id: '1ba1b882-6516-4e54-a1ef-453bb3137d02',
          name: 'Mossie Larkin',
          location: { latitude: '77.5235', longitude: '175.3549' },
          age: 86,
          acceptedOffers: 62,
          canceledOffers: 95,
          averageReplyTime: 3143,
        },
      ],
      '-63.1150',
      '46.7110',
      'averageReplyTime'
    );
    it('This should return 4% for a patient with a location distance greater than the distance of the facility', () => {
      const result = somePatients.scoreByDistance({
        userLongitude: parseFloat('144.9963'),
        userLatitude: parseFloat('-81.0341'),
        facilityLongitude: parseFloat(somePatients.facilityLongtitude),
        facilityLatitude: parseFloat(somePatients.facilityLatitude),
        standardDistance,
      });
      expect(result).to.be.equal(4);
    });
    it('This should return 10% for a patient with a location distance less than the distance of the facility', () => {
      const result = somePatients.scoreByDistance({
        userLongitude: parseFloat('-63.1150'),
        userLatitude: parseFloat('46.7110'),
        facilityLongitude: parseFloat(somePatients.facilityLongtitude),
        facilityLatitude: parseFloat(somePatients.facilityLatitude),
        standardDistance,
      });
      expect(result).to.be.equal(10);
    });
    it('This should return 7% for a patient with a location distance 5 to 5.5km near the facility', () => {
      const result = somePatients.scoreByDistance({
        userLongitude: parseFloat('-63.1150'),
        userLatitude: parseFloat('46.7110'),
        facilityLongitude: parseFloat('-63.0430'),
        facilityLatitude: parseFloat('46.7110'),
        standardDistance,
      });
      expect(result).to.be.equal(7);
    });
  });

  describe('arrange and scoreAll method', () => {
    const newPatients = new Prioritizer(
      patientsMockData,
      '-63.1150',
      '46.7110',
      'averageReplyTime'
    );
    it('This should return an array of patients with their score on a scale of 1 to 10', () => {
      newPatients.scoreAll();
      newPatients.arrange('desc');
      let result =
        newPatients.patients[0].finalScore! >= 5 &&
        newPatients.patients[0].finalScore! <= 10;
      expect(result).to.be.equal(true);
      result =
        newPatients.patients[newPatients.patients.length - 1].finalScore! > 0 &&
        newPatients.patients[newPatients.patients.length - 1].finalScore! <=
          4.9;
      expect(result).to.be.equal(true);
    });
  });

  describe('arrange with argument "asc" ', () => {
    const newPatients = new Prioritizer(
      patientsMockData,
      '-63.1150',
      '46.7110',
      'averageReplyTime'
    );
    it('This finalScore of the first patient should be between 1 and 4.9 while the final score of the last patient should be between 5 and 10', () => {
      newPatients.scoreAll();
      newPatients.arrange('asc');
      let result =
        newPatients.patients[0].finalScore! > 0 &&
        newPatients.patients[0].finalScore! <= 4.9;
      expect(result).to.be.equal(true);
      result =
        newPatients.patients[newPatients.patients.length - 1].finalScore! >=
          5 &&
        newPatients.patients[newPatients.patients.length - 1].finalScore! <= 10;
      expect(result).to.be.equal(true);
    });
  });

  describe('includePatientsWithIncompleteData', () => {
    const newPatients = new Prioritizer(
      patientsMockData,
      '-63.1150',
      '46.7110',
      'averageReplyTime'
    );
    const finalResult = newPatients.startPipeline();
    const patientsWithCompleteInfo =
      newPatients.patients.length -
      newPatients.patientsWithIncompleteDetails.length;

    it('Final result should also include patients with incomplete data randomly placed', () => {
      expect(finalResult.length).to.equal(
        newPatients.patientsWithIncompleteDetails.length +
          patientsWithCompleteInfo,
      );
      let example: IPatient;
      for (let item of finalResult) {
        if (!('averageReplyTime' in finalResult)) {
          example = item;
          return item;
        }
      }
      expect(example!.finalScore).to.equal(undefined);
    });
  });
});
