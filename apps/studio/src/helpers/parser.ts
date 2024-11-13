import { Input, Parser } from '@asyncapi/parser';
import { DocumentInfo } from '@/types';

export default async function parseURL(asyncapiDocument: string): Promise<DocumentInfo | null> {
    const parser = new Parser();

    const base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;

    let decodedDocument: Input = "";

    if (base64Regex.test(asyncapiDocument)) {
        decodedDocument  = Buffer.from(asyncapiDocument, "base64").toString("utf-8");
    } else {
        decodedDocument  = asyncapiDocument;
    }

    const { document, diagnostics } = await parser.parse(decodedDocument);

    if (diagnostics.length) {
        return null;
    }

    let title = document?.info().title();
    if (title) {
        title = title.length <= 20 ? title : title.slice(0, 20) + "...";
    }
    const version = document?.info().version();

    let description = document?.info().description();
    if (description) {
        description = description.length <= 100 ? description : description.slice(0, 100) + "...";
    }

    const servers = document?.allServers();
    const channels = document?.allChannels();
    const operations = document?.allOperations();
    const messages = document?.allMessages();

    const numServers = servers?.length;
    const numChannels = channels?.length;
    const numOperations = operations?.length;
    const numMessages = messages?.length;

    const response = {
        title,
        version,
        description,
        numServers,
        numChannels,
        numOperations,
        numMessages
    };
    return response;
}
