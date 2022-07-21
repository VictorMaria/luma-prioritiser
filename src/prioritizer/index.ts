import { IPatient, fields } from './model';
import patientData from '../../sample-data/patients.json'
import { scoreMetricAsPercent, standardDistance } from './configurables';
import Utilities from '../utility';

interface IAverages {
  [field: string]: number;
}

export default class Prioritizer {
  patients: IPatient[];
  patientsWithIncompleteDetails: IPatient[];
  averages: IAverages = {};
  facilityLongtitude: string;
  facilityLatitude: string;
  field: string;

  constructor(patients: IPatient[], facilityLongtitude: string, facilityLatitude: string, field: string) {
    this.patients = patients;
    this.patientsWithIncompleteDetails = [];
    this.facilityLongtitude = facilityLongtitude;
    this.facilityLatitude = facilityLatitude;
    this.field = field;
  }

  refineData() {
    this.patientsWithIncompleteDetails = this.patients.filter(
      (patient) => Object.keys(patient).length < fields.length
    );
    return this.patientsWithIncompleteDetails;
  }

  calculateAverage(field: string) {
    const sum = this.patients.reduce(
      (previousValue, currentValue: any) => previousValue + currentValue[field],
      0
    );
    this.averages[field] = sum / this.patients.length;
    return this.averages[field];
  }

  scoreByAge(age: number) {
    if (age < 18 || age > 65) {
      return (10 / 10) * scoreMetricAsPercent['age'];
    } else {
      return (5 / 10) * scoreMetricAsPercent['age'];
    }
  }

  scoreByAcceptedOffers(acceptedOffers: number, canceledOffers: number) {
    const totalOffers = acceptedOffers + canceledOffers;
    const percent =
      scoreMetricAsPercent['acceptedOffers'] +
      scoreMetricAsPercent['cancelledOffers'];
    return (acceptedOffers / totalOffers) * percent;
  }

  scoreByAverageReplyTime(patient: any, field: string) {
    if (patient[field] < this.averages[field]) {
      return 20;
    } else {
      return 10;
    }
  }

  scoreByDistance(details: {
    userLongitude: number;
    userLatitude: number;
    facilityLongitude: number;
    facilityLatitude: number;
    standardDistance: number;
  }) {
    const { standardDistance } = details;
    const distanceBetween: number = Utilities.distanceInKMBetweenTwoCoorindates({
      longitude1: details.userLongitude,
      latitude1: details.userLatitude,
      longitude2: details.facilityLongitude,
      latitude2: details.facilityLatitude,
    });
        const allowance: number = 0.5;
    if (distanceBetween >= standardDistance && distanceBetween <= standardDistance + allowance) {
      return 7;
    } else if (distanceBetween < standardDistance) {
      return 10;
    } else {
      return 4;
    }
  }

  scoreAll () {
    this.calculateAverage(this.field);
    for (let patient of this.patients) {
      const scoreByAge = this.scoreByAge(patient.age);
      const scoreByAcceptedOffers = this.scoreByAcceptedOffers(patient.acceptedOffers, patient.canceledOffers);
      const scoreByDistance = this.scoreByDistance(
        {
        userLongitude: parseFloat(patient.location.longitude),
        userLatitude: parseFloat(patient.location.latitude),
        facilityLongitude: parseFloat(this.facilityLongtitude),
        facilityLatitude: parseFloat(this.facilityLatitude),
        standardDistance,
      }
      );
      const scoreByReplyTime = this.scoreByAverageReplyTime(patient, 'averageReplyTime');
      const finalScore = ((scoreByAge + scoreByAcceptedOffers + scoreByDistance + scoreByReplyTime) / 100) * 10;
      patient['finalScore'] = finalScore;
    }

    return this.patients;
  }

  arrange(order: 'asc' | 'desc') {
    if (order === 'asc') {
      this.patients = this.patients.sort((a, b) => a.finalScore! - b.finalScore!);
      return this.patients;
    } else {
      this.patients = this.patients.sort((a, b) => b.finalScore! - a.finalScore!);
      return this.patients;
    }
  }

  includePatientsWithIncompleteData () {
    for (let patient of this.patientsWithIncompleteDetails) {
      const randomIndex = Utilities.getRandomNumber(0, this.patientsWithIncompleteDetails.length);
      this.patients.splice(randomIndex, 0, patient);
    }

    return this.patients;
  }

  startPipeline() {
    this.refineData();
    this.scoreAll();
    this.arrange('desc');
    this.includePatientsWithIncompleteData();
    return this.patients;
  }
}
