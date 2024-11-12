import React, { useEffect, useState } from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
import axios from 'axios';
import { supabase } from "@/lib/supabase";
import { MealDetails, MealRecommendation, SelectedItem } from '@/app/models/models';
  

const Menu: React.FC = () => {
    const [menu, setMenu] = useState<MealRecommendation>();

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) {
                    throw new Error('User is not logged in.');
                }

                const response = await axios.get('http://localhost:8000/menu/get-menu');
                setMenu(response.data);
            } catch (error) {
                console.error('Error fetching menu:', error);
            }
        }
        fetchMenu();
    }, []);

    return (
        <div>
            {menu && Object.entries(menu.meal_information).map(([mealName, mealDetails]: [string, MealDetails]) => (
                <Accordion key={mealName} type="single" collapsible>
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Is it accessible?</AccordionTrigger>
                        <AccordionContent>
                            {Object.entries(mealDetails.selected_items).map(([itemName, itemDetails]: [string, SelectedItem]) => (
                                <p key={itemName}>{itemName}: {itemDetails.number_of_servings} servings</p>
                            ))}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            ))}
        </div>
    )
}

export default Menu;