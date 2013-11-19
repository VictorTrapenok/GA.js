/*
 * GA.js
 * 
 * Copyright (c) 2013, Трапенок Виктор (Trapenok Victor). All rights reserved.
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details. 
 */


/**
 * Генерирует полносвязаный граф
 * @param int vertex
 * @returns {Array}
 */
function GraphGen(vertex)
{
    var gr = new Array();

    var t_part = []

    for(var i=0; i< vertex; i++)
    {
        var link = Math.floor(Math.random()*(vertex-1)); // Связь с вершиной
        var curent_vertex = i;
        if(link === i)
        {
            link--;
            if(link < 0)
            {
                link = vertex - 1;
            }
        }

        if(gr[curent_vertex] === undefined)
        {
            gr[curent_vertex] = [];
        }

        if(gr[link] === undefined)
        {
            gr[link] = [];
            t_part.push(link);
        }
 

        if(gr[curent_vertex].indexOf(link) === -1 )
        {
            gr[curent_vertex].push(link);
        }

        if(gr[link].indexOf(curent_vertex) === -1 )
        {
            gr[link].push(curent_vertex);
        }

    }

    console.log(["GRAPH", gr, t_part])

    for(var i=1; i< t_part.length; i++)
    {
        if(gr[ t_part[i] ].indexOf(t_part[i-1]) === -1 )
        {
            gr[ t_part[i] ].push(t_part[i-1]);
        }

        if(gr[ t_part[i-1] ].indexOf(t_part[i]) === -1 )
        {
            gr[ t_part[i-1] ].push(t_part[i]);
        }
    }

    if(gr[ t_part[0] ].indexOf(t_part[t_part.length-1]) === -1 )
    {
        gr[ t_part[0] ].push(t_part[t_part.length-1]);
    }

    if(gr[ t_part[t_part.length-1] ].indexOf(t_part[0]) === -1 )
    {
        gr[ t_part[t_part.length-1] ].push(t_part[0]);
    }


    console.log(["GRAPH", gr, t_part])

    for(var i=0; i< gr.length; i++)
    {
        console.log("G"+i, gr[i])
    }

    return gr
}

laba1 = function ()
{
    this.gr = GraphGen(100); // Граф и его размерность

    /**
     * Генерирует сущьности
     * @returns {Array} entity
     */
    this.gen = function()
    {
        var entity = []

        var last = this.gr[0][ Math.floor((this.gr[0].length ) * Math.random()) ]
        do
        {
            entity.push( last )
            last = this.gr[last][ Math.floor((this.gr[last].length ) * Math.random()) ]
            
            if(entity.length > 2)
            { 
                while(   entity[entity.length-2] === last  && this.gr[last].length > 1)
                {
                    last = this.gr[last][ Math.floor((this.gr[last].length ) * Math.random()) ]
                }
            }
            
            if( entity.length > 10 *this.gr.length )
            {
                break;
            }

        }while( this.test(entity) === -1 );


        return entity;
    } 

    /**
     * Тестирует на пригодность переданую сущьность
     * @param array entity сущьность
     * @returns {Number|@exp;entity@pro;length} Коэфицент пригодности, чем меньше тем лучше или -1 в случаии полной непригодности индивида.
     */
    this.test = function(entity)
    { 
        //console.error(entity)
        for(var k in this.gr)
        { 
            if(entity.indexOf(k/1) === -1)
            {
                return -1; // Не прошол по всем вершинам.
            }
        }

        return entity.length;
    }

    this.generation = [] // Особи поколения
    this.generation_size = 8; // Размер поколения
 
    
    this.getAnswer = function()
    {
        var k = 0;
        var re = 999; // Хранит значение минимальной найденой длины
        var rkn = 0;  // Хранит текущее количество итераций не приведших к улучшению ответа
        var max_itr = 12 // Максимальное количество поколений
        do{
            k++;
            if(this.generation.length > 0)
            {
                console.log("Итерация:"+k+"  Длина:"+ this.test( this.generation[0] )  )
            }
            else
            {
                console.log("Итерация:"+k)
            }
            
            for(var i=0; i < this.generation_size; i ) // Цикл генерации поколений
            {
                var entity = this.gen()
                
                if( this.test(entity) !== -1)
                {
                    console.log(i, this.test(entity))
                    i++;
                    this.generation.push(entity)
                }
            }

            if(this.generation.length < 3)
            {
                console.error( "Ошибка генерации length = " + this.generation.length)
                return this.generation;
            }
            
            var thisObj = this;
            this.generation.sort(function(a, b){ // Сортировка сгенерированых поколений по степени их пригодности
                return thisObj.test(a)  - thisObj.test(b)
            })
              
            this.generation.splice( Math.floor(this.generation.length/3 ), this.generation.length) // Отрезаем наименне адоптированных
             
            if( re - this.test( this.generation[0] )  === 0 )
            {   // Если было 4 итерации без улучшения ответа то завершить работу.
                rkn ++
                if(rkn > 4)
                { 
                    console.log("Top:", this.generation[0])
                    return this.generation;
                }
            }
            else
            {
               rkn = 0;
            }
            re = this.test( this.generation[0] )  // Запоминаем лучший результат за текущее поколение
             
        }while( k < max_itr);
    }
}




    var laba = new laba1()
    answer = laba.getAnswer()
    console.log("УРА! УРА! УРА!\nTop:", answer)