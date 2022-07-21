export interface IPatient {
    id: string;
    name: string;
    age: number;
    location: {
        longitude: string;
        latitude: string;
    };
    acceptedOffers: number;
    canceledOffers: number;
    averageReplyTime?: number;
    finalScore?: number;
}

export const fields = [ 'id', 'name', 'age', 'location', 'acceptedOffers', 'canceledOffers', 'averageReplyTime' ]