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