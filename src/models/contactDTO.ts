class ContactDTO {
  readonly id: string;
  readonly name: string;
  readonly avatar: string;
  readonly vkLink?: string;
  readonly instagramLink?: string;
  readonly facebookLink?: string;
  readonly phone?: string;
  readonly shortDescription?: string;
}

export { ContactDTO };
