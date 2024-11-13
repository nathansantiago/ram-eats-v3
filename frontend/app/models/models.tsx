export interface SelectedItem {
    number_of_servings: number;
}

export interface MealDetails {
    selected_items: {
        [key: string]: SelectedItem;
    };
    total_calories: number;
    total_protein: number;
    total_carbs: number;
    total_fats: number;
}

export interface MealInformation {
    [key: string]: MealDetails;
}

export interface MealRecommendation {
    meal_information: MealInformation;
}

export interface MenuGetMenuOutput {
    meal_information: MenuStations
}

export interface MenuStations {
    [key: string]: MenuItem[]; 
}

export interface MenuItem {
    option_id: number;
    station_id: number;
    option_name: string;
    AmountPerServing?: string;
    "AmountPerServing½cup"?: string;
    Calories: number;
    TotalFat: number;
    SaturatedFat: string;
    TransFat: string;
    Cholesterol: string;
    Sodium: string;
    TotalCarbohydrate: string;
    DietaryFiber: string;
    Sugars: string;
    AddedSugar?: string;
    Protein: number;
    Calcium: string;
    Iron: number;
    Potassium: number;
    VitaminD: number;
    Soy?: string;
    Wheat?: string;
    Sesame?: string;
}