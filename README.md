# **Project title**

***
## **UX**
The **five planes of user experience design** developed by Jesse James Garrett was used as the conceptual framework for the development process of this site

### **Strategy Plane**
There were two perspectives I needed to take into account when planning out the strategy of my site. These perspectives would help me to create a list of user stories to use when designing the site. These perspectives were:
  * Site Owner Perspective 

  * Site Viewer Perspective 

For the perspective of ....
For the perspective of ....

### **User Stories**

#### Site Owner:

As as developer I want to...

1. Design a game I would enjoy playing
2. Design a game with a basic artificial intelligence
3. Create something that I can use in my portfolio
4. Design a game with some level of difficulty that requires strategic thinking

#### Site Viewer:

As a user playing a game...

1. I want the base game mechanic to be satisfying
2. I want to be rewarded for progress
3. I want to have a challenge which I can overcome
4. I want the game graphics to be visually appealling
5. I want to enjoy playing the game
6. I want the controls to be responsive
6. I want multiple levels in the game

As a user playing this particular game...

### **Scope Plane**
For the Scope plane, I made some initial key design choices....

#### **Key Design Choices**


### **Planned Feature List**
In order to plan out the development process, I created a list of features which I wanted to implement. I split these features into two groups. One group was for features that would be needed for a minimum viable product. The second group was a list of features that would be good to have, but were not top priority. I planned to implement as many of these features as possible, if I achived all features in the minimum viable product group. 

**Group 1: Minimum Viable Product**
|Feature|Description|Importance (1-10)|
|:--:|:--:|:--:|
|Level Generator|A generator to create a level on the game page|10|
|User Controlled Character|a charcater that can be controlled with arrow keys|10|
|Enemy Character with Basic AI|An enemy charcater that follows the user around the map|10|
|Base Chasing Mechanic|Organic chase given by the cat to the user|10|
|Character Collision Detection|Characters can recognise obstacles around them|10|
|Competent Enemy AI|Enemy AI has the ability to act after detecting an obstacle|10|
|Multiple Level Layout|Level Generator can make multiple levels|9|
|User Success Feedback|When the user gets the goal destination|8|
|Winning Screen Modal|Success Modal|7|
|Enemy Capture Feedback|When the users mouse character gets caught by the cat|7|
|Losing Screen Modal|Failure Modal|6|
|Time Limit| A time limit to encourage the user to make drastic moves|6|
|Restart Button|User can restart a level at any point|6|
|Graphics|Sprites for the mouse and cat|6|
|Main Menu|User can choose level, cat difficulty|6|


**Group 2: Secondary Features**
|Feature|Description|Importance (1-10)|
|:--:|:--:|:--:|
|Advanced Enemy AI|Enemy AI can calculate the nearest route to the goal destination|High|
|Sound Effects||High|
|Multiple Device Compatible||High|
|Fetch Quests||High|
|Multiple Enemies||High|
|Powerups||High|
|Animated Avatars||High|
|Animated Levels||High|
|Weapons||High|
|High Scores||High|
|Object Orientated Programming||High|
|Cat Expressions Graphic||High|



### **Structure Plane**
For the structure of the site ....

#### Site Structure:

1. **Template 1 - Page/Footer/Header**  


### **Skeleton Plane**
For the skeleton plane, I created wireframes ....

#### Wireframes:

* 

### **Surface Plane**

#### Colour Palette
In order to choose an overall colour palette for the page(s)....


#### Fonts
* 

***
## Features
### Existing Features
|Feature|Description|Location|
|:--:|:--:| :--:|


### Features Left to Implement


## Technologies Used

* [Visual Studio Code](https://code.visualstudio.com/)  
Code editor I used to write my code
* [Live Server VS Code Extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)  
Extension I used to see in real time the effect that the changes I was making to my code would have
* [HTML](https://en.wikipedia.org/wiki/HTML5)  
For markup
* [CSS](https://en.wikipedia.org/wiki/CSS)  
For styling the site
* [Boostrap Framework](https://getbootstrap.com/)  
I used the bootstrap grid system to help me design responsive layouts and I made customized versions of various boostrap components throughout the page
* [Google Fonts](https://fonts.google.com/)  
For the font used in the site
* [Font Awesome](https://fontawesome.com/)  
Used for icons throughout the site
* [Git](https://git-scm.com/)  
For version control
* [GitHub](https://github.com/)  
For storing my files and for hosting the site on Github Pages
* [Canva](https://www.canva.com/)  
I used a premium version of this tool to create various images throughout the site, most notably the project card images
* [favicon-generator.org](https://www.favicon-generator.org/)  
Used to generate a favicon for the site from an image I created using Canva
* [resizeimage.net](https://resizeimage.net/)  
Used to resize images on the page to improve Lighthouse scores
* [placeholder.com](https://placeholder.com/)  
I used this site to create small blocks of colour for the colour palette section of this README
* [Balsamiq](https://balsamiq.com/  
Used to create wireframes
***

## Testing


### **Notable Bugs Occurring During Development**
During the development phase of the site, I encountered a number of significant bugs while testing the output of my code. They were all mistakes which led to important lessons learned for future projects. These are documented below:
#### **Misplaced Nav Bar**

<!-- <img src="assets\documents\testing\error_misplaced_navbar.png" alt="misplaced navbar error" width="250"/>  -->

* **Description**  
 
* **Root Cause and Fix**  


### HTML Validator Results
After passing my code through the HTML validator for the first time

#### Error Messages


#### Warnings


### CSS Validator
After passing my code through the CSS validator for the first time

#### Warnings

### Lighthouse
To analyse the Performance, Accessibility and User Experience of my site, I used [Lighthouse](https://developers.google.com/web/tools/lighthouse) in Chrome developer tools.

#### Results

* Improving Performance Score  

* Improving Best Practices Score   


### User Stories Validation

<!-- **O1 - "with this site I want to get offers for jobs in software development"**  
Of all of the user stories this is the only one which cannot be fully validated yet as I have not yet used this site for job applications. I am confident however that it will satisfy this in the future. -->

***

## Version Control
* To begin the project I created a remote repository on Github by choosing the **New Repository** button and following the on screen steps.
* I then created a local repository using Git:
   *  I created a directory on my computer called **template**
   *  I opened the directory using VS code and started a terminal
   *  I initialized the directory as a Git repository using the command `git init`
   *  I added a README to the file using the command `git add README.md`
   *  I then created an index.html file in the directory and started working on the site
   *  When I was ready to commit my first set of changes, I used the `git add .` and the `git commit -m "Initial commit"` commands in my terminal
   
* In order to store my commits remotely on Github, I linked my local repository to the remote repository:
   * In my VS code terminal, I used the command `git remote add origin https://github.com/steharr/` and `git remote -v`

* Throughout the development process, I would regularly push my commits to Github using the `git push` command 

## Deployment
* The website has been deployed using Github pages. In order to do this, I followed the steps given in the GitHub docs page on [Configuring a publishing source for your GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site):

   * In the repository, select **Settings**
   * Select the **Pages** tab
   * Select **main** as the publishing source, using the Branch drop down menu

***
## Credits

### Code


### Content
All written content was created by me

### Media

* Images

### Acknowledgements

* My mentor, **Spencer Barriball** who guided me through this project.
* Fellow **Code Institute** students on Slack who helped troubleshoot issues and give me inspiration for this project