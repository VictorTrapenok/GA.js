/*
 * Simulated_annealing.js
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

Simulated_annealing = function ()
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
     * Зменяет у сущьности весе элементы начиная с start
     * @returns {Array} entity
     */
    this.ReGenFrom = function(base_entity, start)
    {
        var entity = base_entity.slice(start-1);

        var last = base_entity[start]
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
    this.generation_size = 4; // Размер поколения



    this.getAnswer = function()
    {
        var k = 0;
        var curent_step = 0;
        var re = 999; // Хранит значение минимальной найденой длины
        var rkn = 0;  // Хранит текущее количество итераций не приведших к улучшению ответа
        var max_itr = 50 // Максимальное количество поколений
        
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
         
        do{
            k++;
            curent_step++;
            if(this.generation.length > 0)
            {
                console.log("Итерация:"+k+" curent_step:"+curent_step+"  Длина:"+ this.test( this.generation[0] )  )
            }
            else
            {
                console.log("Итерация:"+k+" curent_step:"+curent_step )
            }
  
            var temp_generation_array = []
            for(var i=0; i < this.generation_size; i ) // Цикл отжига (уменьшение температуры)
            {
                if(curent_step >= this.generation[i].length)
                {
                    console.log("Цепочка "+i+" остыла и имеет длину "+this.generation[i].length)
                    continue;
                }
                var new_entity = this.ReGenFrom(this.generation[i], curent_step); // Изменение цепочки начиная с элемента curent_step и до конца

                if( this.test(new_entity) !== -1)
                {
                    if( new_entity.length < this.generation[i].length )
                    { 
                        console.log("old:"+this.generation[i].length+"\tnew:"+new_entity.length)
                        temp_generation_array.push(new_entity)
                    }
                    else
                    { 
                        temp_generation_array.push(this.generation[i])
                    }
                    
                    i++;
                }
            }
            
            this.generation = temp_generation_array.slice(0);

 
            this.generation.sort(function(a, b){ // Сортировка сгенерированых поколений по степени их пригодности
                return a.length  - b.length;
            })
            
            
            if( re - this.test( this.generation[0] )  === 0 )
            {   // Если было 4 итерации без улучшения ответа то завершить работу.
                rkn ++;
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

        }while( k < max_itr && curent_step < re );
    }
}




    var sa = new Simulated_annealing()
    answer = sa.getAnswer()
    console.log("УРА! УРА! УРА!\nTop:", answer)