# macpro-mdct-mfp

MDCT is doing work for Money Follows the Person MFP

#### DynamoDB Local failed to start with code 1

If you're getting an error such as `inaccessible host: 'localhost' at port '8000'`, some steps to try:

- confirm that you're on the right Java version -- if you have an M1 mac, you need an [x86 install](https://www.azul.com/downloads/?version=java-18-sts&os=macos&architecture=x86-64-bit&package=jdk#zulu)
- delete your `services/database/.dynamodb` directory and then run `dev local` in your terminal
