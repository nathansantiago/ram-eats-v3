"use client"

import React, { useEffect, useState } from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import axios from 'axios';
import { supabase } from "@/lib/supabase";
import { MenuGetMenuOutput, MenuStations, MenuItem } from '@/app/models/models';
  

const Menu: React.FC = () => {
    const [menu, setMenu] = useState<MenuGetMenuOutput>();

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
            {menu && Object.entries(menu.meal_information).map(([stationName, menuItems]: [string, MenuItem[]]) => (
                <Accordion key={stationName} type="single" collapsible>
                    <AccordionItem value={stationName}>
                        <AccordionTrigger>{stationName}</AccordionTrigger>
                        <AccordionContent>
                            {menuItems.map((item: MenuItem) => (
                                <Drawer key={item.option_id}>
                                    <DrawerTrigger>{item.option_name}</DrawerTrigger>
                                    <DrawerContent>
                                    <DrawerHeader>
                                    <DrawerTitle>{item.option_name}</DrawerTitle>
                                    <div className="flex">
                                        <div>
                                        <DrawerDescription>Amount Per Serving: {item.AmountPerServing}</DrawerDescription>
                                        <DrawerDescription>Amount Per Serving ½ cup: {item["AmountPerServing½cup"]}</DrawerDescription>
                                        <DrawerDescription>Calories: {item.Calories}</DrawerDescription>
                                        <DrawerDescription>Total Fat: {item.TotalFat}</DrawerDescription>
                                        <DrawerDescription>Saturated Fat: {item.SaturatedFat}</DrawerDescription>
                                        <DrawerDescription>Trans Fat: {item.TransFat}</DrawerDescription>
                                        <DrawerDescription>Cholesterol: {item.Cholesterol}</DrawerDescription>
                                        <DrawerDescription>Sodium: {item.Sodium}</DrawerDescription>
                                        <DrawerDescription>Total Carbohydrate: {item.TotalCarbohydrate}</DrawerDescription>
                                        </div>
                                        <div>
                                        <DrawerDescription>Dietary Fiber: {item.DietaryFiber}</DrawerDescription>
                                        <DrawerDescription>Sugars: {item.Sugars}</DrawerDescription>
                                        <DrawerDescription>Added Sugar: {item.AddedSugar}</DrawerDescription>
                                        <DrawerDescription>Protein: {item.Protein}</DrawerDescription>
                                        <DrawerDescription>Calcium: {item.Calcium}</DrawerDescription>
                                        <DrawerDescription>Iron: {item.Iron}</DrawerDescription>
                                        <DrawerDescription>Potassium: {item.Potassium}</DrawerDescription>
                                        <DrawerDescription>Vitamin D: {item.VitaminD}</DrawerDescription>
                                        <DrawerDescription>Soy: {item.Soy}</DrawerDescription>
                                        <DrawerDescription>Wheat: {item.Wheat}</DrawerDescription>
                                        <DrawerDescription>Sesame: {item.Sesame}</DrawerDescription>
                                        </div>
                                    </div>
                                    </DrawerHeader>
                                    <DrawerFooter>
                                    <Button>Add to account</Button>
                                    <DrawerClose>
                                        <Button variant="outline">Close</Button>
                                    </DrawerClose>
                                    </DrawerFooter>
                                    </DrawerContent>
                                </Drawer>
                            ))}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            ))}
        </div>
    )
}

export default Menu;