export const handler = async (event) => {
    const body = JSON.parse(event.body);
    console.log("Received Data:", body); // In a real app, this goes to DynamoDB
    
    return {
        statusCode: 200,
        headers: { "Access-Control-Allow-Origin": "*" }, // Allows your website to talk to it
        body: JSON.stringify({ message: "Health data logged successfully" }),
    };
};