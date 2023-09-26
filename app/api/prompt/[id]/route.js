import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";

//GET
export const GET = async (request, { params }) => {

    try {
        await connectToDB();

        const prompt = await Prompt.findById(params.id).where({}).populate('creator');

        if(!prompt) {
            return new Response("Prompt not found", { status: 404 });
        }

        return new Response(JSON.stringify(prompt), { status: 201 });
    } catch (error) {
        return new Response("Failed to fetch prompt", { status: 500 });
    }
}

//PATCH
export const PATCH = async (request, {params}) => {
    const { prompt, tag, userId } = await request.json();

    try {

        await connectToDB();

        const existingPrompt = await Prompt.findById(params.id);

        if(existingPrompt.creator._id !== userId) {
            return new Response("Prompted not created by you, you can't edit it", { status: 401 })
        }

        if(!existingPrompt) {
            return new Response("Prompt not found", { status: 404 });
        }

        existingPrompt.prompt = prompt;
        existingPrompt.tag = tag;

        await existingPrompt.save();

        return new Response(JSON.stringify(existingPrompt), { status: 200 });

    } catch (error) {
        return new Response("Failed to update prompt", { status: 500 });
    }
}

//DELETE
export const DELETE = async (request, { params }) => {
    try {
        await connectToDB();

        await Prompt.findByIdAndRemove(params.id);

        return new Response("Prompt delete successfully", { status: 200 });
    } catch (error) {
        return new Response("Failed to delete prompt", { status: 500 })
    }
}
