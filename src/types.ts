export interface CustomerList{
    status: boolean,
    data: {
        records: Record[];
    }
}

export interface Record{
    IDNo: number;
    EntityName: string;
    Address1: string;
    City: string;
    State: string;
    Zip: string;
    MainPhone: string;
    EmailMain: string;
    PrimaryContact: string;
    LocCode: string;
    JobTitle: string | null;
    Department: string | null;
    MobilePhone: string | null;
    TermsCodeID: number;
    Notes: string;
}

export interface PageState {
    skip: number;
    take: number;
  }