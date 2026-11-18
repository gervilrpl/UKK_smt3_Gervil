import {
    CheckIcon,
    CreditCardIcon,
    InfoIcon,
    MailIcon,
    SearchIcon,
    StarIcon,
} from "lucide-react"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group"
import { Card } from "@radix-ui/themes/dist/cjs/components/index.js"
import { Button } from "@/components/ui/button"


export default function ProfilePage() {
    return (
        <div className="flex min-h-[80vh] items-center justify-center">
            <Card className="m-6 w-full max-w-lg">
                <h1 className="text-2xl font-bold mb-2">Form User</h1>
                <p>Create your user here.</p>
                <div className="grid w-full max-w-lg gap-6 mt-4">
                    <InputGroup>
                        <InputGroupInput placeholder="Search..." />
                        <InputGroupAddon>
                            <SearchIcon />
                        </InputGroupAddon>
                    </InputGroup>
                    <InputGroup>
                        <InputGroupInput type="email" placeholder="Enter your email" />
                        <InputGroupAddon>
                            <MailIcon />
                        </InputGroupAddon>
                    </InputGroup>
                    <InputGroup>
                        <InputGroupInput placeholder="Card number" />
                        <InputGroupAddon>
                            <CreditCardIcon />
                        </InputGroupAddon>
                        <InputGroupAddon align="inline-end">
                            <CheckIcon />
                        </InputGroupAddon>
                    </InputGroup>
                    <InputGroup>
                        <InputGroupInput placeholder="Card number" />
                        <InputGroupAddon align="inline-end">
                            <StarIcon />
                            <InfoIcon />
                        </InputGroupAddon>
                    </InputGroup>
                    <Button>Save User</Button>
                </div>
            </Card>
        </div>
    )
}