/**
 * Type definitions for @abhay557/fakedata
 * A high-performance synthetic data generation engine
 * for ML, deep learning, and data science workflows.
 */

export namespace data {
    export interface Education {
        level: "High School" | "Associate's" | "Bachelor's" | "Master's" | "PhD" | "Dropout";
        field: string | null;
        institution: string;
        institutionCountry: string;
        gpa: number | null;
        graduationYear: number | null;
        studentDebt: number;
    }

    export interface Employment {
        status: "employed" | "self-employed" | "unemployed" | "student" | "retired" | "freelancer";
        company: string | null;
        companySize: "startup" | "small" | "medium" | "enterprise" | null;
        industry: string | null;
        jobTitle: string | null;
        jobCategory: string | null;
        yearsExperience: number;
        workMode: "onsite" | "hybrid" | "remote" | null;
        workHoursPerWeek: number;
        jobSatisfaction: number | null;
    }

    export interface Financial {
        annualIncome: number;
        creditScore: number;
        savings: number;
        monthlyExpenses: number;
        debtToIncome: number;
        taxBracket: string;
        investmentStyle: "conservative" | "moderate" | "aggressive";
        homeOwnership: "rent" | "own" | "mortgage" | "live with family";
    }

    export interface Demographics {
        ethnicity: string;
        nationality: string;
        language: {
            primary: string;
            secondary: string | null;
        };
        relationshipStatus: "single" | "dating" | "married" | "divorced" | "widowed";
    }

    export interface Address {
        street: string;
        city: string;
        state: string;
        country: string;
        countryCode: string;
        zipCode: number;
        coordinates: {
            latitude: string;
            longitude: string;
        };
    }

    export interface Bank {
        nameOnCard: string;
        cardNumber: string;
        cardType: string;
        cardExpiry: string;
        cardCvv: string;
    }

    export interface TechnologyProfile {
        devices: {
            additional_devices: string[];
            smartphone: string;
        };
        phone_preferences: {
            critical_features: string[];
            primary_uses: string[];
        };
        interest: string[];
    }

    export interface Health {
        bmi: number;
        bmiCategory: "underweight" | "normal" | "overweight" | "obese";
        bloodPressure: {
            systolic: number;
            diastolic: number;
        };
        exerciseFrequency: "sedentary" | "1-2 times/week" | "3-4 times/week" | "5+ times/week" | "daily";
        smoking: "never" | "former" | "current" | "occasional";
        alcohol: "never" | "social" | "moderate" | "heavy" | "former";
        sleepHoursPerNight: number;
        sleepQuality: "poor" | "fair" | "good" | "excellent";
        diet: "omnivore" | "vegetarian" | "vegan" | "pescatarian" | "keto" | "paleo" | "mediterranean";
        medicalCondition: string;
        insuranceProvider: string;
        medications: string[];
        lastCheckupMonthsAgo: number;
        hasDisability: boolean;
        mentalHealth: "good" | "fair" | "poor";
        vaccination: "fully vaccinated" | "partially vaccinated" | "not vaccinated";
    }

    export interface SocialMedia {
        platforms: string[];
        screenTimeHoursPerDay: number;
        preferredContent: "video" | "text" | "audio" | "images";
    }

    export interface Shopping {
        frequency: "never" | "rarely" | "monthly" | "weekly" | "daily";
        preferredCategories: string[];
        monthlyOnlineSpending: number;
    }

    export interface Social {
        socialMedia: SocialMedia;
        shopping: Shopping;
        newsSource: string;
        travelFrequency: string;
        volunteers: boolean;
        pet: string;
    }

    export interface DigitalFootprint {
        accountCreatedAt: string;
        lastLoginAt: string;
        lastPasswordChangeAt: string;
        userAgent: string;
        browser: string;
        os: string;
        referrer: string;
        avgSessionMinutes: number;
        sessionsPerWeek: number;
        totalSessions: number;
        twoFactorEnabled: boolean;
        preferredLanguage: string;
        accountStatus: "active" | "inactive" | "suspended";
        verifiedEmail: boolean;
        verifiedPhone: boolean;
    }

    export interface UserOptions {
        /** Probability (0-1) that each leaf field becomes null. For ML missing data simulation. */
        missing_rate?: number;
        /** Random seed for reproducibility. Same seed = identical output. */
        seed?: number;
    }

    /** Flat user record with dot-separated keys (for CSV/DataFrame usage). */
    export type FlatUser = Record<string, string | number | boolean>;

    export interface User {
        id: string;
        fullName: string;
        firstName: string;
        lastName: string;
        middleName: string;
        age: number;
        gender: "male" | "female" | "non-binary";
        email: string;
        phone: string;
        username: string;
        password: string;
        birthDate: string;
        bloodGroup: string;
        height: number;
        weight: number;
        domain: string;
        ip: string;
        macaddress: string;
        address: Address;
        demographics: Demographics;
        education: Education;
        employment: Employment;
        financial: Financial;
        health: Health;
        social: Social;
        digitalFootprint: DigitalFootprint;
        bank: Bank;
        hobbies: string[];
        technology_profile: TechnologyProfile;
    }

    export interface Resume {
        id: string;
        fullName: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        age: number;
        address: Address;
        education: Education;
        employment: Employment;
        skills: string[];
    }

    export interface Biodata extends User {
        personalityType: string;
        favoriteMusic: string;
    }

    export function user(options?: UserOptions): User;
    export function users(count?: number, options?: UserOptions): User[];
    export function usersToCSV(count?: number, options?: UserOptions): string;
    export function usersToJSON(count?: number, options?: UserOptions): string;
    export function usersFlat(count?: number, options?: UserOptions): FlatUser[];
    export function getEmail(): { email: string };
    export function getUsername(): { username: string };
    export function getPassword(length?: number): { password: string };
    export function getZipCode(): { zipCode: number };
    export function getCoordinates(): { latitude: string; longitude: string };
    export function getCity(): { city: string };
    export function getStateCode(): { stateCode: string };
    export function creditcard(): Bank;
    export function address(): Address & { ip: string; macaddress: string };
    export function resume(count?: number): Resume[];
    export function biodata(count?: number): Biodata[];
}
