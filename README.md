# Gourds and Grocers Market 🎃

[**Gourds and Grocers**](https://gourds-and-grocers-fc1e690d830c.herokuapp.com/) is a web application that models real-world e-commerce website focusing on grocery retailers selling fall seasonal items.

## Planning Phase

### User Stories

As a User (AAU):
* AAU, I want to view the marketplace offerings without having to sign in or sign up. I want to be able to search items, sort and filter them.
* AAU, I want to be able to sign up as a grocer.
* AAU, I want to be able to sign up as a shopper.
* AAU, I want to be able to deactivate my account.

As a Shopper (AAS):
* AAS, I want to view offerings and add items to my cart in the quantity I need.
* AAS, I want to be able to see if the item is out of stock. If it is out of stock, I want to see if it will be restocked and when.
* AAS, I want to view my cart and check out my cart.
* AAS, I want to be able to view my past orders.
* AAS, I want to be able to view my store credit balance, and add more money if I want.

As a Grocer (AAG):
* AAG, I want to be able to create a listing for the item I am selling. I want to specify the quantity and price.
* AAG, I want to be able to view my listings.
* AAG, I want to be able to modify my listings, change price / quantity / description (etc), or archive my listings.
* AAG, I want to be able to view my profits and sales.


### Wireframe
Wireframe work was completed using Figma.

![gourds and grocers wireframe](./assets/planning/GG_wireframe.png)

Flow chart work was completed using FigJam.

![gourds and grocers wireframe](./assets/planning/GG_Flow.png)

### ERD

ERD work was completed using FigJam. The data models use both embedding and referencing. ```Cart``` model utilizes subschema for items in the cart (item id and quantity). All three models reference each other.

![gourds and grocers data models](./assets/planning/Gourds_and_Grocers_ERD.png)

### Trello

Visit the [Trello board](https://trello.com/invite/b/66feb6176c1bcc2536c185a2/ATTI8316b2cb783b5f6d5f2cde6bac6a100bEB6DE678/gourds-and-grocers-web-app) for the project.

![trello board screenshot](./assets/planning/trello.png)

## Technologies Used

* Node.js
* Express.js
* MongoDB, Mongoose
* HTML / CSS / JavaScript

## Routes

| Route    | Method | Description | Need sign-in? |
| -------- | ------- | ------- | ------- | 
| ```/``` | GET | Render home page of the website | No |

### Auth.js Controller

| Route    | Method | Description | Need sign-in? |
| -------- | ------- | ------- | ------- |
| ```/auth/sign-up``` | GET | Render sign-up page | No |
| ```/auth/sign-in``` | GET | Render sign-in page | No |
| ```/auth/sign-out``` | GET | Sign user out and destroy req.session | No |
| ```/auth/sign-up``` | POST | Sign user up | No |
| ```/auth/sign-in``` | POST | Sign user in | No |

### Market.js Controller

| Route    | Method | Description | Need sign-in? |
| -------- | ------- | ------- | ------- |
| ```/market``` | GET | Render market page | No |
| ```/market/sort``` | GET | Display sorted market page | No |
| ```/market/filter``` | GET | Display filtered market page | No |
| ```/market/search``` | GET | Display searched market page | No |
| ```/market/item/:id``` | GET | Render item page | No |
| ```/market/signed-in``` | GET | Render market page | Yes |
| ```/market/signed-in/sort``` | GET | Display sorted market page | Yes |
| ```/market/signed-in/filter``` | GET | Display filtered market page | Yes |
| ```/market/signed-in/search``` | GET | Display searched market page | Yes |
| ```/market/item/:id/shop``` | GET | Render item page | Yes |

### Groceries.js Controller

| Route    | Method | Description | Need sign-in? |
| -------- | ------- | ------- | ------- |
| ```/groceries``` | GET | Render grocer's listings page | Yes |
| ```/groceries/home``` | GET | Render grocer's home page | Yes |
| ```/groceries/archived``` | GET | Render grocer's archived listings page | Yes |
| ```/groceries/new``` | GET | Render grocer's new listing page | Yes |
| ```/groceries/account``` | GET | Render grocer's account page | Yes |
| ```/groceries/history``` | GET | Render grocer's past sales page | Yes |
| ```/groceries/:id``` | GET | Render grocer's single listing page | Yes |
| ```/groceries/:id/edit``` | GET | Render grocer's single listing's edit page | Yes |
| ```/groceries``` | POST | Post new listing | Yes |
| ```/groceries/account/deactiv``` | PUT | Deactivate grocer's account | Yes |
| ```/groceries/:id/inactive``` | POST | Archive listing | Yes |
| ```/groceries/:id/relist``` | POST | Reactivate listing | Yes |
| ```/groceries/:id``` | PUT | Update existing listing | Yes |


### Shop.js Controller

| Route    | Method | Description | Need sign-in? |
| -------- | ------- | ------- | ------- |
| ```/shop``` | GET | Render shopper's home page | Yes |
| ```/shop/account``` | GET | Render shopper's account page | Yes |
| ```/shop/history``` | GET | Render shopper's past orders page | Yes |
| ```/shop/account``` | PUT | Update account's store credit  | Yes |
| ```/shop/account/deactiv``` | PUT | Deactivate shopper's account  | Yes |

### Cart.js Controller

| Route    | Method | Description | Need sign-in? |
| -------- | ------- | ------- | ------- |
| ```/cart``` | GET | Get shopper's cart view | Yes |
| ```/cart/:id``` | POST | Add grocery item to the cart | Yes |
| ```/cart/:id/remove``` | PUT | Remove grocery item from the cart | Yes |
| ```/cart/clear``` | PUT | Clear cart | Yes |
| ```/cart/checkout``` | PUT | Check out cart | Yes |


## Types of Users

### Signed-Out Functionality

### Grocer Functionality

### Shopper Functionality

## Pages

Battleship game has multiple HTML templates. Besides the landing page (index.html), Battleship has:
* **Play-setup.html** – page to setup player's fleet.
* **Play.html** – main playing page where the player plays against computer.
* **Instructions.html** – page containing instructions on setup and play logic.
* **Winloss.html** – it is rendered when one player wins.

#### *Landing page*
![landing page screenshot](./assets/index.png)

#### *Play-setup page*
![play-setup page screenshot](./assets/play-setup.png)
##### *Fleet setup*
![play-setup page screenshot](./assets/play-setup2.png)
![play-setup page screenshot](./assets/play-setup3.png)

#### *Play page*
![play page screenshot](./assets/play.png)
![play page screenshot](./assets/play2.png)
![play page screenshot](./assets/play3.png)

#### *Win/loss page*
![win/loss page screenshot](./assets/winloss.png)

#### *Instructions page*
![instructions page screenshot](./assets/instructions.png)

### Mobile versions

#### *Play-setup page on mobile*
![play-setup page mobile screenshot](./assets/play-setup-mobile.png)

#### *Play page on mobile*
![play page mobile screenshot](./assets/play-mobile.png)

#### *Instructions page on mobile*
![instructions page mobile screenshot](./assets/instructions-mobile.png)

### JS model files

### JS controller files



* Script.js

Main JS file with all the variables, cached elements, game functions, and event listeners. Other files serve as module to this one.

* Math.js

Math.js mainly calculates cell IDs. The grid-size is irrelevant – the HTML grid can be of any size (6x6 or 10x10 or 15x15 or anything else), and the functions will recalculate everything accordingly.

* Board-setup.js

Board-setup.js contains additional functions to display board setup on the page.

* Reset.js

Reset.js contains functions for go back button.

* Call-cell.js

Identifies the cell clicked.




## Future improvements

### Combining User and Grocer Into One User

TODO

The logic for the computer setup employs a recursive function that sometimes leads to maximum call stack error as it can't find the next cell for the ship. If it happens, reloading the page usually solves it, but ideally this needs to be debugged. 

What happens is that the game does not account for ships occupying other cells when it calculates orientation and adjacent cells. Imagine the situation below from a player setup:

![instructions page mobile screenshot](./assets/bug.png)
After the carrier was set, battleship needs to occupy 4 cells. It technically can't go horizontally since there is not enough room. However, the code still suggests horizontal cell as an option. See what happens if we click on the horizontal cell:
![instructions page mobile screenshot](./assets/bug2.png)
A player can click GO BACK button in this situation and restart the building process of this specific ship.

The computer, however, does not have a GO BACK button. In this situation, it will keep looking for a cell to occupy via recursive function depicted below. It won't find any options and will exceed maximum call stack.

```javascript
    
    // render ships for computer
    function computerBoard() {
      
        //...picking the cell from available ones...
        
        if (shipsOnBoard === shipsComputer.length) {
            
            computerReady = true;
            console.log(aGrid);
            return true;

        } else {
            
            // recursive function (untill all ships are completed)
            computerBoard();

        }

    }
    
    computerBoard();
```

In order to solve this issue, I need to introduce another function that recalculates the available cells to ensure that the computer does not see starting cells with not enough room nearby as an option.

### Color values in JS
Colors below for ```fire``` and ```suggest``` keys do not properly work if passed as hex values. The ```unhighlightCells()``` function does not remove the color. If they are passed as simple string color names, everything works. Not sure why this is happening. Ideally, shamrock green color would replace the ```fire``` and ```suggest``` values.
```javascript
const colors = {
    block: "white",
    adjacent: "#415A77", 
    suggest: "mediumseagreen",
    board: "#E0E1DD",
    ship: "#778DA9", 
    button: "indianred",
    fire: "mediumseagreen", //#4DA167(shamrock green)
    hit: "indianred",
    miss: "#415A77", 
    dead: "#0D1B2A",
    firebutton: "grey",
    disabled: "grey" 
}
```

### Mobile
The mobile version of the game can be improved further. The grid is too large, and its cells do not maintain 1/1 aspect ratio. The appearance and related functionality need more work.

### Site menu – mobile
Site menu should shrink into a menu icon that displays a drop-down menu once clicked.

### Audio sounds
The game can employ various sounds to make it more entertaining. Sounds can differ based on whether the attack hit a ship or whether it sank a ship.

### Emojis
At this time, the game uses Unicode emojis to depict the ships. They are stored as strings and easily retrievable from the object depicted below.

```javascript
const ships = [
    {
        name: "carrier",
        length: 5,
        emoji: "🚢", 
        location: [],
        hits: 0,
        alive: true
    }
]
```
For the design improvement of the game, it would be great to use pixelated PNG emojis of the ships, similar to the one depicted below. However, it is not yet clear on how to store a retrievable PNG inside the object as a string without making it too complicated.

### Sources

* Unsplash (stock images)
* chatGPT (item description generator)