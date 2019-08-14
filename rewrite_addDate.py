import sys

with open(sys.argv[1], 'r') as reader, open(sys.argv[2], 'w') as writer:
   lines = map(lambda x: '"2019-05-30 ' + x[1:], reader.readlines())	
   writer.writelines(lines)