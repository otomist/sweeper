//sweeper2.0
var sweeper = window.appController.minesweeper
var pId = sweeper.localPlayerId
var me = sweeper.getPlayer(pId)

var BLANK = 9,
BOMB = 0,
FLAG = 16,
BOMBHIT = 0,
HIDDEN = 10,
PROX1 = 1,
PROX2 = 2,
PROX3 = 3,
PROX4 = 4,
PROX5 = 5,
PROX6 = 6,
PROX7 = 7,
PROX8 = 8,
EDGE = 11

//returns the neigbors of the tile
getNeighbors = function(x,y)
{
	return sweeper.playGrid.getNeighbors(x,y)
}

//returns the id of the tile
getTileId = function(x,y)
{
	return sweeper.playGrid.get(x,y)
}

//returns if the tile is a flag or a hitbomb
isPosDangerous = function(x,y)
{
	var id = getTileId(x,y)
	return id == BOMBHIT || id > 11
}

//returns if the tile is a flag or a hitbomb
isDangerous = function(obj)
{
	var id = getTileId(obj.x,obj.y)
	//console.log("DANGER ID:",id)
	//console.log(id == BOMBHIT || id > 11)
	return id == BOMBHIT || id > 11
}

//returns true if the tile is a proxy
isProxy = function(x,y)
{
	var id = getTileId(x,y)
	return id > 0 &&  id < 9
}

//returns true if the tile is an outdated proxy
isOutdated = function(x,y)
{
	if(isProxy(x,y))
	{	
	var id = getTileId(x,y)
	//console.log("(",x,y,")is:",id)
	neighbors = getNeighbors(x,y)
	nearbyDangers = neighbors.filter(isDangerous)
	//console.log("neighbors_ filtered", nearbyDangers)
	//console.log("length: ", nearbyDangers.length)
	return id == nearbyDangers.length
	}
	else
	{	
		//console.log("not proxy")
	}
}

getHiddenNeighbors = function(x,y)
{
	return getNeighbors(x,y).filter(function(obj){
		return HIDDEN == getTileId(obj.x,obj.y)
	})
}

snipe = function()
{
	var w = sweeper.playGrid.width
	var h = sweeper.playGrid.height
	for(i = 0; i < w; i++)
		{
			for(j = 0; j < h; j++)
			{
				if(isProxy(i,j))
				{
					//console.log("proxy")
					if(isOutdated(i,j))
					{
					gold = getHiddenNeighbors(i,j)
						if(gold.length > 0)
						{
							oldscore = me.points
							gold.forEach(function(obj)
							{
								sweeper.revealCell(obj.x,obj.y,sweeper.localPlayerId)
								//for debugging
								if(oldscore > me.points)
								{
									//console.log("lost score at: ", obj, getTileId(obj.x, obj.y))
								}	
								else if(oldscore == me.points)
								{
									//console.log("no points gained:", obj, getTileId(obj.x, obj.y))
								}
								else
								{
									//console.log("", obj, getTileId(obj.x, obj.y))
								}
								//end of debugging
							})
							return true
						}
					}
				}
			}
		}
	return false
}

sweep = function(seconds=1)
{

	window.setInterval(snipe, seconds*1000);
}