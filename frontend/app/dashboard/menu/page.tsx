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
import { Minus, Plus } from "lucide-react"
import axios from 'axios';
import { supabase } from "@/lib/supabase";
import { MenuGetMenuOutput, MenuStations, MenuItem } from '@/app/models/models';
  

const Menu: React.FC = () => {
    const [menu, setMenu] = useState<MenuGetMenuOutput>();
    const [portions, setPortions] = useState(0);

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

    function adjustPortion(adjustment: number) {
        setPortions(Math.max(0, Math.min(5, portions + adjustment)))
      }

    return (
        <div>
            {menu && Object.entries(menu.meal_information).map(([stationName, menuItems]: [string, MenuItem[]]) => (
                <Accordion key={stationName} type="single" collapsible>
                    <AccordionItem value={stationName}>
                        <AccordionTrigger>{stationName}</AccordionTrigger>
                        <AccordionContent>
                            {menuItems.map((item: MenuItem) => (
                                <Drawer key={item.option_id}>
                                    <DrawerTrigger onClick={() => setPortions(0)}>{item.option_name}</DrawerTrigger>
                                    <div className="mx-auto w-full max-w-sm">
                                    <DrawerContent>
                                    <DrawerHeader>
                                    <DrawerTitle className='text-4xl font-bold'>{item.option_name}</DrawerTitle>
                                        <div className='grid grid-cols-2 py-2'>
                                        {/* <DrawerDescription>Amount Per Serving: {item.AmountPerServing}</DrawerDescription>
                                        <DrawerDescription>Amount Per Serving ½ cup: {item["AmountPerServing½cup"]}</DrawerDescription> */}
                                            <DrawerDescription className='text-lg'>Calories: {item.Calories}</DrawerDescription>
                                            <DrawerDescription className='text-lg'>Total Fat: {item.TotalFat}g</DrawerDescription>
                                            <DrawerDescription className='text-lg'>Saturated Fat: {item.SaturatedFat}</DrawerDescription>
                                            <DrawerDescription className='text-lg'>Trans Fat: {item.TransFat}</DrawerDescription>
                                            <DrawerDescription className='text-lg'>Cholesterol: {item.Cholesterol}</DrawerDescription>
                                            <DrawerDescription className='text-lg'>Sodium: {item.Sodium}</DrawerDescription>
                                            <DrawerDescription className='text-lg'>Total Carbohydrates: {item.TotalCarbohydrate}</DrawerDescription>
                                            <DrawerDescription className='text-lg'>Dietary Fiber: {item.DietaryFiber}</DrawerDescription>
                                            <DrawerDescription className='text-lg'>Sugars: {item.Sugars}</DrawerDescription>
                                            <DrawerDescription className='text-lg'>Added Sugar: {item.AddedSugar ? item.AddedSugar : "0g"}</DrawerDescription>
                                            <DrawerDescription className='text-lg'>Protein: {item.Protein}g</DrawerDescription>
                                            <DrawerDescription className='text-lg'>Calcium: {item.Calcium}</DrawerDescription>
                                            <DrawerDescription className='text-lg'>Iron: {item.Iron}mg</DrawerDescription>
                                            <DrawerDescription className='text-lg'>Potassium: {item.Potassium}mg</DrawerDescription>
                                            <DrawerDescription className='text-lg'>Vitamin D: {item.VitaminD}mcg</DrawerDescription>
                                        </div>
                                        {(item.Soy || item.Wheat || item.Sesame) && (
                                                <>
                                                    {/* <DrawerDescription className='text-lg font-bold'>Allergen Warnings</DrawerDescription> */}
                                                    {item.Soy && <DrawerDescription className='text-lg font-bold'>Contains Soy</DrawerDescription>}
                                                    {item.Wheat && <DrawerDescription className='text-lg font-bold'>Contains Wheat</DrawerDescription>}
                                                    {item.Sesame && <DrawerDescription className='text-lg font-bold'>Contains Sesame</DrawerDescription>}
                                                </>
                                        )}
                                    </DrawerHeader>
                                    <DrawerFooter>
                                    <div className="flex items-center justify-center space-x-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8 shrink-0 rounded-full"
                                            onClick={() => adjustPortion(-1)}
                                            disabled={portions <= 0}
                                        >
                                            <Minus />
                                            <span className="sr-only">Decrease</span>
                                        </Button>
                                        <div className="flex-1 text-center">
                                            <div className="text-7xl font-bold tracking-tighter">
                                            {portions}
                                            </div>
                                            <div className="text-[0.70rem] uppercase text-muted-foreground">
                                            Portions Eaten
                                            </div>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8 shrink-0 rounded-full"
                                            onClick={() => adjustPortion(1)}
                                            disabled={portions >= 5}
                                        >
                                            <Plus />
                                            <span className="sr-only">Increase</span>
                                        </Button>
                                    </div>
                                    <Button>Add to account</Button>
                                    <DrawerClose>
                                        <Button variant="outline">Close</Button>
                                    </DrawerClose>
                                    </DrawerFooter>
                                    </DrawerContent>
                                    </div>
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