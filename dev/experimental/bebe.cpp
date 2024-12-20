/*------------------------------------------------------------------------------
Coelhinho Bebe
Authors:	Folklore Foxykissus (Foxy), Grumpy Critter (Bunbun)

Foxy's Notes:
	I legitimately do not know what I'm doing with this. I need to get better
	at writing C++ code. I have more experience with C, so there is a lot of
	C-based code in this that might not make sense. Please be patient with me.

Bunbun's Note:
	Don't worry, love, I'll be patient with you and you'll learn it quickly <3

------------------------------------------------------------------------------*/

#include <iostream>

using namespace std; // @Bunbun: I see this UwU
					 // @Foxy: OwO'

/**
* @Bunbun: In C++ you can make use of 'constexpr' instead of '#define'.
* - 'constexpr' is way better when defining constants as they can be scoped.
* - Whereas '#define' is global and imposing, it'll replace anything that matches its symbol, potentially breaking code.
* - 'constexpr' was actually a great addition to C++
* - in C you'd have to use enums (i.e. enum { MAX_STRLEN = 20 }) but enums are very limiting.
*/
//constexpr unsigned MAX_STRLEN = 20; // @Bunbun: Not being used anymore but left here as example (The 'unsigned' is explained at line 85)

/**
* @Bunbun: In C++ you can use 'nullptr' to define a null pointer. In this case I'm using it to check the end of menu operations.
* - Search for 'OPS_END' to see where it's being used.
*/
constexpr const char *OPS_END = nullptr;

void dispGameTitle(void);

/**
* @Bunbun: a multi-dimension array 'char [][MAX_STRLEN]' as function argument should always be declared as a pointer to a pointer 'char **'
* - I also added 'const' before 'char' as that's not supposed to be modified, you'll get the hang of when to put 'const' and when not to.
*/
void dispStartMenu(const char **arr);

int getChoice();


/*********** MAIN ***********/

int main(void) // @Bunbun: There's no need to declare 'int argc, char *argv[]' if you're not going to use them
{
	/********** VARIABLE DECLARATIONS ***********/
	int x;


	/**
	* @Bunbun: Some notes on this one...
	* - If you already know the strings you wanna use, there's no need to use 'strcpy', you can declare them right away.
	* - Reason being is that 'strcpy' is a runtime operation, so it'll take unnecessary processing for strings that could be declared at compilation.
	* - 'strcpy' is only used when the value of a string is not known and get changed during runtime.
	*/
	/* Menu options/operations strings */
	const char *startMenuOps[] = // @Bunbun: 'startMenuOps' is an array of strings 'const char *[]', so it fits in a 'const char **' argument like in 'dispStartMenu'
	{
		"New Game",
		"Load Game",
		"Quit Game", // @Foxy: I usually like this to be option 0, how would I do this?
		OPS_END // @Bunbun: 'OPS_END' used here to define the end. There's a much better way to do it though, but that's for another time.
				/* @Foxy: owo */
	};

	dispGameTitle();
	dispStartMenu(startMenuOps);
	x = getChoice();
	if (x == -1) /* @Foxy: probably can make a switch statement here later */
	{
		/* user entered a improper option */
		cout << endl << "That's not an option." << endl;
	}
	else
	{
		cout << ". " << startMenuOps[x] << endl;
		/* do more eventually */
	}

	cout << "[i] End of program." << endl;
	return 0;
}


/*********** FUNCTION DEFINITIONS ***********/

void dispGameTitle(void) 
{
	cout << "  +-----------------------+\n"
		 << "  | Coelhinho Bebe  |\n"
		 << "  |v0.1 |\n"
		 << "  +-----------------------+\n"
		 << endl;
}


void dispStartMenu(const char **arr) 
{
	/* display the start menu */
	unsigned i = 0; // @Bunbun: When reading array indices, it's always nice to use 'unsigned' as it's an absolute number, never negative.
	cout << "Welcome to the game. Please enter a number choice from the menu below." << endl;
	while (arr[i] != OPS_END) // @Bunbun: 'OPS_END' used here to check for the end
	{
		//printf("[i] %p\n", &arr[i]); // debug
		cout << i << ".\t" << arr[i] << endl;
		i++;
	}
	cout << "Your choice: "; // @Foxy: I didn't put a endl here because after the user presses
							 // enter, I wanted the name of the option to appear before it goes
							 // to the next line. What I'm envisioning happens in the prompt:
							 // >>> Your Choice:
							 // >>> Your Choice: 0 		<entered by user>
							 // >>> Your choice: 0. New Game
							 // program continues...
							 // But it doesn't work that way... I wonder if the return carriage
							 // /newline character is being caught with 'cin'?
}


int getChoice()
{
	/* get a choice from the player and return it */
	int x;
	cin >> x;
	if ( (x < 0) || (x > 3) ) 	// @Foxy: This needs to take in a larger range of values because
								// I plan to reuse this function. I would like it to not only 
								// accept unsigned integers, but also characters like 'a','b','c', etc.
		return -1; /* option is invalid */
	else
		return static_cast<unsigned int>(x); /* option is acceptable */
}


/* end of program */