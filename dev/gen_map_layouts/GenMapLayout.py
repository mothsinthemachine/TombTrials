
import sys

def main():
	mArray = []
	y = -1
	try:
		inputFilename = sys.argv[1].lstrip(".\\")
		try:
			y = int(sys.argv[2])
		except:
			print("Y-tile-integer cannot be converted to integer.")

		with open(inputFilename,'r') as file:
			for line in file:
				mArray.append("\"")
				numbers = line.split(",")
				for n in numbers:
					try:
						x = int(n)
					except:
						if (n == '\n' or n == ''):
							mArray.append('\",\n')
							continue
					
					if (x == 0):
						mArray.append(' ')
					elif (y != -1 and y == x):
						mArray.append('y')
					else:
						mArray.append('x')
		mArray.append("\"")
		file.close()
		result = ''.join(mArray)
		outputFilename = inputFilename.rstrip(".txt")+"_output.txt"
		file = open(outputFilename,'w')
		file.write("Copy and paste the following into the configuration file for the map:\n"+result)
		file.close()
	except:
		print("x_x")
		print("<script> <source> <y-tile-integer>")

main()